import { action } from '@ember-decorators/object';
import { or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
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
    queryParams?: any;
    analyticsScope?: string;

    // Private properties
    maxPage?: number;
    items?: any[];
    errorShown: boolean = false;

    @or('model', 'modelTaskInstance.value')
    modelInstance?: OsfModel;

    loadItemsTask = task(function *(this: PaginatedList) {
        const blocker = this.ready.getBlocker();
        try {
            let model = this.modelInstance;
            if (!model && this.modelTaskInstance) {
                model = yield this.modelTaskInstance;
            }
            if (!model) {
                throw new Error('Error loading model');
            }
            const items = yield model.queryHasManyTask.linked().perform(
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
            blocker.done();
        } catch (e) {
            this.set('errorShown', true);
            blocker.errored(e);
            throw e;
        } finally {
            this.set('reload', false);
        }
    }).restartable();

    constructor(...args: any[]) {
        super(...args);

        assert(
            'Must provide either `model` xor `modelTaskInstance` to {{paginated-relation}}',
            Boolean(this.model) !== Boolean(this.modelTaskInstance),
        );

        this.loadItems();
    }

    didUpdateAttrs(this: PaginatedList) {
        if (this.reload) {
            this.setProperties({
                page: 1,
            });
        }
        this.loadItems();
    }

    loadItems(this: PaginatedList) {
        return this.get('loadItemsTask').perform();
    }

    @action
    next(this: PaginatedList) {
        if (this.analyticsScope) {
            this.analytics.click('button', `${this.analyticsScope} - Pagination Next`);
        }
        this.incrementProperty('page');
        this.loadItems();
    }

    @action
    previous(this: PaginatedList) {
        if (this.analyticsScope) {
            this.analytics.click('button', `${this.analyticsScope} - Pagination Previous`);
        }
        this.decrementProperty('page');
        this.loadItems();
    }
}
