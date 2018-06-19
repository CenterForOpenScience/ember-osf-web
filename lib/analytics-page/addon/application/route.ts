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

        // If the node without related counts is still loading, wait for it to finish so:
        //   1) the ember-data store doesn't dedupe the request
        //   2) we know modelName has been correctly populated
        yield this.routeContext.guidTaskInstance;

        return yield this.store.findRecord(this.routeContext.modelName!, this.routeContext.guid!, {
            reload: true,
            adapterOptions: {
                query: {
                    related_counts: true,
                },
            },
        });
    });

    model(this: AnalyticsPageRoute) {
        return {
            taskInstance: this.get('getNodeWithCounts').perform(),
            id: this.routeContext.guid,
        };
    }
}
