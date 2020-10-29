import Component from '@ember/component';
import { action } from '@ember/object';
import ComputedProperty from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { Task } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

import Analytics from 'ember-osf-web/services/analytics';
import Ready from 'ember-osf-web/services/ready';
import defaultTo from 'ember-osf-web/utils/default-to';

export interface LoadItemsOptions {
    reloading: boolean;
}

export default abstract class BaseDataComponent extends Component {
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
    //
    // We must initialize this to itself because of task decorators (otherwise
    // it ends up being undefined in child classes), but then we have to
    // @ts-ignore because TS doesn't let us initialize abstract properties
    abstract loadItemsTask: ComputedProperty<Task<void>> = this.loadItemsTask;

    @restartableTask({ withTestWaiter: true })
    async loadItemsWrapperTask({ reloading }: LoadItemsOptions) {
        const blocker = this.ready.getBlocker();

        // Resolve race condition on init: Let component finish initializing before continuing
        // TODO: Remove once we have task decorators, so the child classes' tasks are defined on the prototype
        // yield; TODO: Do we need this?

        try {
            await taskFor(this.loadItemsTask).perform(reloading);
            blocker.done();
        } catch (e) {
            this.set('errorShown', true);
            blocker.errored(e);
            throw e;
        }
    }

    didReceiveAttrs() {
        this.set('page', 1);
        if (this.bindReload) {
            this.bindReload(this._doReload.bind(this));
        }
        taskFor(this.loadItemsWrapperTask).perform({ reloading: false });
    }

    @action
    _doReload(page: number = 1) {
        this.setProperties({ page });
        taskFor(this.loadItemsWrapperTask).perform({ reloading: true });
    }

    @action
    next() {
        this.incrementProperty('page');
        taskFor(this.loadItemsWrapperTask).perform({ reloading: false });
    }

    @action
    previous() {
        this.decrementProperty('page');
        taskFor(this.loadItemsWrapperTask).perform({ reloading: false });
    }
}
