import { service } from '@ember-decorators/service';
import { assert } from '@ember/debug';
import Route from '@ember/routing/route';
import RouteContext from 'ember-osf-web/services/route-context';

export default class AnalyticsPageRoute extends Route {
    @service routeContext!: RouteContext;

    model() {
        assert('Must have a GUID context', Boolean(this.routeContext.guid && this.routeContext.guidTaskInstance));
        return {
            taskInstance: this.routeContext.guidTaskInstance,
            id: this.routeContext.guid,
        };
    }
}
