import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task, Task } from 'ember-concurrency';

import Analytics from 'ember-osf-web/services/analytics';
import Ready from 'ember-osf-web/services/ready';
import defaultTo from 'ember-osf-web/utils/default-to';

export default abstract class BaseDataComponent extends Component.extend({
    loadItemsWrapperTask: task(function *(this: BaseDataComponent) {
        const blocker = this.ready.getBlocker();

        // Resolve race condition on init: Let component finish initializing before continuing
        // TODO: Remove once we have task decorators, so the task is defined on the prototype
        yield;

        try {
            yield this.get('loadItemsTask').perform(this.reload);
            blocker.done();
        } catch (e) {
            this.set('errorShown', true);
            blocker.errored(e);
            throw e;
        } finally {
            this.set('reload', false);
        }
    }).restartable(),
}) {
    // Optional arguments
    page: number = defaultTo(this.page, 1);
    pageSize: number = defaultTo(this.pageSize, 10);
    reload: boolean = defaultTo(this.reload, false);
    query?: any;
    analyticsScope?: string;

    // Private properties
    @service ready!: Ready;
    @service analytics!: Analytics;

    totalCount?: number;
    items?: any[];
    errorShown: boolean = false;

    // Will be performed with arguments:
    //  reloading: boolean
    abstract loadItemsTask: Task<void>;

    constructor(...args: any[]) {
        super(...args);
        this.loadItemsWrapperTask.perform();
    }

    didUpdateAttrs(this: BaseDataComponent) {
        if (this.reload) {
            this.setProperties({
                page: 1,
            });
        }
        this.loadItemsWrapperTask.perform();
    }

    @action
    next(this: BaseDataComponent) {
        if (this.analyticsScope) {
            this.analytics.click('button', `${this.analyticsScope} - Pagination Next`);
        }
        this.incrementProperty('page');
        this.loadItemsWrapperTask.perform();
    }

    @action
    previous(this: BaseDataComponent) {
        if (this.analyticsScope) {
            this.analytics.click('button', `${this.analyticsScope} - Pagination Previous`);
        }
        this.decrementProperty('page');
        this.loadItemsWrapperTask.perform();
    }

    @action
    onDeleteItem() {
        this.loadItemsWrapperTask.perform(true);
    }
}
