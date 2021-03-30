import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import Analytics from 'ember-osf-web/services/analytics';
import Ready from 'ember-osf-web/services/ready';

export interface LoadItemsOptions {
    reloading: boolean;
}

export default abstract class BaseDataComponent extends Component {
    // Optional arguments
    pageSize: number = 10;
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

    async loadItemsTask(_: LoadItemsOptions) {
        throw new Error('Must implement loadItemsTask');
    }

    @restartableTask
    async loadItemsWrapperTask({ reloading }: LoadItemsOptions) {
        const blocker = this.ready.getBlocker();

        try {
            await taskFor(this.loadItemsTask).perform({ reloading });
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
