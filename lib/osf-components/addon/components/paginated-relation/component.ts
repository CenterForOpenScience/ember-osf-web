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

    // Either model xor modelTask is required
    model?: OsfModel;
    modelTask?: TaskInstance<OsfModel>;

    // Optional arguments
    page: number = defaultTo(this.page, 1);
    pageSize: number = defaultTo(this.pageSize, 10);
    reload: boolean = defaultTo(this.reload, false);
    queryParams?: any;
    analyticsScope?: string;

    // Private properties
    maxPage?: number;
    items?: any[];

    @or('model', 'modelTask.value')
    modelInstance?: OsfModel;

    loadItemsTask = task(function *(this: PaginatedList) {
        const blocker = this.ready.getBlocker();
        try {
            let model = this.modelInstance;
            if (!model && this.modelTask) {
                model = yield this.modelTask;
            }
            if (!model) {
                throw new Error('Error loading list');
            }
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
            });
            blocker.done();
        } catch (e) {
            blocker.errored(e);
        } finally {
            this.set('reload', false);
        }
    }).restartable();

    constructor(...args: any[]) {
        super(...args);

        assert(
            'Must provide either `model` xor `modelTask` to {{paginated-relation}}',
            Boolean(this.model) !== Boolean(this.modelTask),
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
