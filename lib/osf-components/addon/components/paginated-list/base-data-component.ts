import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import ComputedProperty from '@ember/object/computed';
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
        }
    }).restartable(),
}) {
    // Optional arguments
    pageSize: number = defaultTo(this.pageSize, 10);
    query?: any;

    // Exposes a reload action the the parent scope.
    // Usage: `bindReload=(action (mut this.reload))`, then call `this.reload()` to trigger a reload
    // NOTE: Don't use this pattern too often, it could get messy. Try to reserve it for telling
    // data-loading components to refresh themselves.
    bindReload?: (action: (page?: number) => void) => void;

    // Private properties
    @service ready!: Ready;
    @service analytics!: Analytics;

    totalCount?: number;
    items?: any[];
    errorShown: boolean = false;
    page: number = 1;

    // Will be performed with an options hash of type LoadItemsOptions
    abstract loadItemsTask: ComputedProperty<Task<void>>;

    didReceiveAttrs() {
        if (this.bindReload) {
            this.bindReload(this._doReload.bind(this));
        }
        this.loadItemsWrapperTask.perform({ reloading: false });
    }

    @action
    _doReload(page: number = 1) {
        this.setProperties({ page });
        this.loadItemsWrapperTask.perform({ reloading: true });
    }

    @action
    next(this: BaseDataComponent) {
        this.incrementProperty('page');
        this.loadItemsWrapperTask.perform({ reloading: false });
    }

    @action
    previous(this: BaseDataComponent) {
        this.decrementProperty('page');
        this.loadItemsWrapperTask.perform({ reloading: false });
    }
}
