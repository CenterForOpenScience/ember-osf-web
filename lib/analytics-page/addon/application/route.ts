import { service } from '@ember-decorators/service';
import { assert } from '@ember/debug';
import Route from '@ember/routing/route';
import { task, TaskInstance } from 'ember-concurrency';
import DS from 'ember-data';

import featureFlagRoute from 'ember-osf-web/decorators/feature-flag-route';
import Node from 'ember-osf-web/models/node';
import AnalyticsService, { analyticPrivacy } from 'ember-osf-web/services/analytics';
import RouteContext from 'ember-osf-web/services/route-context';

@featureFlagRoute()
export default class AnalyticsPageRoute extends Route {
    @service analytics!: AnalyticsService;
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

    didTransition() {
        let privacy = analyticPrivacy.undefined;
        const taskInstance = this.routeContext.guidTaskInstance as TaskInstance<Node> | undefined;
        if (taskInstance && taskInstance.value) {
            privacy = taskInstance.value.public ? analyticPrivacy.public : analyticPrivacy.private;
        }
        this.analytics.trackPage(privacy, this.routeContext.modelName);
    }
}
