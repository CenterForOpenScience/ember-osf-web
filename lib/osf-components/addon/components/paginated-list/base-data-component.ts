import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task, Task } from 'ember-concurrency';

import Analytics from 'ember-osf-web/services/analytics';
import Ready from 'ember-osf-web/services/ready';
import defaultTo from 'ember-osf-web/utils/default-to';

export interface LoadItemsOptions {
    reloading: boolean;
}

export default abstract class BaseDataComponent extends Component.extend({
    loadItemsWrapperTask: task(function *(
        this: BaseDataComponent,
        { reloading }: LoadItemsOptions,
    ) {
        const blocker = this.ready.getBlocker();

        // Resolve race condition on init: Let component finish initializing before continuing
        // TODO: Remove once we have task decorators, so the child classes' tasks are defined on the prototype
        yield;

        try {
            yield this.get('loadItemsTask').perform(reloading);
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
    query?: any;
    analyticsScope?: string;

    // Automatically set to false after each load. Set it to `true` in the parent scope to trigger a reload.
    // TODO: Don't use this pattern again; it's messy.
    reload: boolean = defaultTo(this.reload, false);

    // Private properties
    @service ready!: Ready;
    @service analytics!: Analytics;

    totalCount?: number;
    items?: any[];
    errorShown: boolean = false;

    // Will be performed with an options hash of type LoadItemsOptions
    abstract loadItemsTask: Task<void>;

    constructor(...args: any[]) {
        super(...args);
        this.loadItemsWrapperTask.perform({ reloading: false });
    }

    didUpdateAttrs(this: BaseDataComponent) {
        if (this.reload) {
            this._doReload();
        } else {
            this.loadItemsWrapperTask.perform({ reloading: false });
        }
    }

    @action
    _doReload(page: number = 1) {
        this.setProperties({ page });
        this.loadItemsWrapperTask.perform({ reloading: true });
    }

    @action
    next(this: BaseDataComponent) {
        if (this.analyticsScope) {
            this.analytics.click('button', `${this.analyticsScope} - Pagination Next`);
        }
        this.incrementProperty('page');
        this.loadItemsWrapperTask.perform({ reloading: false });
    }

    @action
    previous(this: BaseDataComponent) {
        if (this.analyticsScope) {
            this.analytics.click('button', `${this.analyticsScope} - Pagination Previous`);
        }
        this.decrementProperty('page');
        this.loadItemsWrapperTask.perform({ reloading: false });
    }
}
