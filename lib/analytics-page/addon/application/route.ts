import { service } from '@ember-decorators/service';
import { assert } from '@ember/debug';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import RouteContext from 'ember-osf-web/services/route-context';

export default class AnalyticsPageRoute extends Route {
    @service store!: DS.Store;
    @service routeContext!: RouteContext;

    getNodeWithCounts = task(function *(this: AnalyticsPageRoute) {
        assert('Must have a GUID context', Boolean(this.routeContext.guid && this.routeContext.guidTaskInstance));

        const { modelName, guid } = this.routeContext;
        return yield this.store.findRecord(modelName!, guid!, {
            reload: true,
            adapterOptions: {
                query: {
                    related_counts: true,
                },
            },
        });
    });

    loadModel = task(function *(this: AnalyticsPageRoute) {
        // If the node without related counts is still loading, wait for it to finish so:
        //   1) the ember-data store doesn't dedupe the request
        //   2) we know modelName has been correctly populated
        //   3) we know whether the node is public before rendering
        yield this.routeContext.guidTaskInstance;

        return {
            id: this.routeContext.guid,
            modelName: this.routeContext.modelName,
            taskInstance: this.get('getNodeWithCounts').perform(),
        };
    });

    model(this: AnalyticsPageRoute) {
        return this.get('loadModel').perform();
    }
}
