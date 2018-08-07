import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { assert } from '@ember/debug';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import AnalyticsService from 'ember-osf-web/services/analytics';
import Ready, { Blocker } from 'ember-osf-web/services/ready';
import RouteContext from 'ember-osf-web/services/route-context';

export default class AnalyticsPageRoute extends Route {
    @service analytics!: AnalyticsService;
    @service ready!: Ready;
    @service routeContext!: RouteContext;
    @service store!: DS.Store;

    getNodeWithCounts = task(function *(this: AnalyticsPageRoute, readyBlocker: Blocker) {
        assert('Must have a GUID context', Boolean(this.routeContext.guid && this.routeContext.guidTaskInstance));

        const { modelName, guid } = this.routeContext;
        const node = yield this.store.findRecord(modelName!, guid!, {
            reload: true,
            adapterOptions: {
                query: {
                    related_counts: true,
                },
            },
        });
        readyBlocker.done();
        return node;
    });

    loadModel = task(function *(this: AnalyticsPageRoute) {
        const readyBlocker = this.ready.getBlocker();

        // If the node without related counts is still loading, wait for it to finish so:
        //   1) the ember-data store doesn't dedupe the request
        //   2) we know modelName has been correctly populated
        //   3) we know whether the node is public before rendering
        yield this.routeContext.guidTaskInstance;

        const reloadTaskInstance = this.get('getNodeWithCounts').perform(readyBlocker);
        this.routeContext.set('guidTaskInstance', reloadTaskInstance);

        return {
            id: this.routeContext.guid,
            modelName: this.routeContext.modelName,
            taskInstance: reloadTaskInstance,
        };
    });

    model(this: AnalyticsPageRoute) {
        return this.get('loadModel').perform();
    }

    @action
    didTransition() {
        this.analytics.trackPage(true, this.routeContext.modelName);
    }
}
