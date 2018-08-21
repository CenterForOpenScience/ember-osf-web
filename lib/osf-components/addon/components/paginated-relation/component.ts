import { action, computed } from '@ember-decorators/object';
import { or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed as computedProperty, defineProperty } from '@ember/object';
import { task, TaskInstance } from 'ember-concurrency';

import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import OsfModel from 'ember-osf-web/models/osf-model';
import Analytics from 'ember-osf-web/services/analytics';
import Ready from 'ember-osf-web/services/ready';
import defaultTo from 'ember-osf-web/utils/default-to';
import layout from './template';

@localClassNames('PaginatedList')
export default class PaginatedList extends Component {
    layout = layout;

    @service ready!: Ready;
    @service analytics!: Analytics;

    relationshipName!: string; // Required argument

    // Either model xor modelTaskInstance is required
    model?: OsfModel;
    modelTaskInstance?: TaskInstance<OsfModel>;

    // Optional arguments
    page: number = defaultTo(this.page, 1);
    pageSize: number = defaultTo(this.pageSize, 10);
    reload: boolean = defaultTo(this.reload, false);
    usePlaceholders: boolean = defaultTo(this.usePlaceholders, true);
    queryParams?: any;
    analyticsScope?: string;

    // Private properties
    maxPage?: number;
    items?: any[];
    errorShown: boolean = false;
    count!: number;

    @or('model', 'modelTaskInstance.value')
    modelInstance?: OsfModel;

    getModelTask = task(function *(this: PaginatedList) {
        let model = this.modelInstance;
        if (!model && this.modelTaskInstance) {
            model = yield this.modelTaskInstance;
        }
        if (!model) {
            throw new Error('Error loading model');
        }
        return model;
    });

    loadItemsTask = task(function *(this: PaginatedList) {
        const model = yield this.get('getModelTask').perform();
        const items = yield model.queryHasMany(
            this.relationshipName,
            {
                page: this.page,
                'page[size]': this.pageSize,
                ...this.queryParams,
            },
        );
        this.setProperties({
            items,
            maxPage: Math.ceil(items.meta.total / this.pageSize),
            errorShown: false,
        });
    }).restartable();

    loadRelatedCountTask = task(function *(this: PaginatedList, reload: boolean) {
        const model = yield this.get('getModelTask').perform();
        if (reload || typeof model.relatedCounts[this.relationshipName] === 'undefined') {
            yield model.loadRelatedCount(this.relationshipName);
        }
    }).restartable();

    @computed('count')
    get placeholderCount() {
        if (this.count && this.count > this.pageSize) {
            const pages = Math.ceil(this.count / this.pageSize);
            if (this.page < pages) {
                return this.pageSize;
            }
            return this.count % this.pageSize;
        }
        return this.count || 0;
    }

    constructor(...args: any[]) {
        super(...args);

        assert(
            'Must provide either `model` xor `modelTaskInstance` to {{paginated-relation}}',
            Boolean(this.model) !== Boolean(this.modelTaskInstance),
        );

        defineProperty(
            this,
            'count',
            computedProperty(
                `modelInstance.relatedCounts.${this.relationshipName}`,
                () => (this.modelInstance ? this.modelInstance.relatedCounts[this.relationshipName] : undefined),
            ),
        );

        this.loadItems();
    }

    didUpdateAttrs(this: PaginatedList) {
        if (this.reload) {
            this.setProperties({
                page: 1,
            });
        }
        this.loadItems(this.reload);
    }

    async loadItems(this: PaginatedList, reloadCount: boolean = false) {
        const blocker = this.ready.getBlocker();
        try {
            if (this.usePlaceholders) {
                await this.get('loadRelatedCountTask').perform(reloadCount);
            }
            await this.get('loadItemsTask').perform();
            blocker.done();
        } catch (e) {
            this.set('errorShown', true);
            blocker.errored(e);
            throw e;
        } finally {
            this.set('reload', false);
        }
    }

    @action
    next() {
        if (this.analyticsScope) {
            this.analytics.click('button', `${this.analyticsScope} - Pagination Next`);
        }
        this.incrementProperty('page');
        this.loadItems();
    }

    @action
    previous() {
        if (this.analyticsScope) {
            this.analytics.click('button', `${this.analyticsScope} - Pagination Previous`);
        }
        this.decrementProperty('page');
        this.loadItems();
    }

    @action
    onDeleteItem() {
        this.loadItems(true);
    }
}
