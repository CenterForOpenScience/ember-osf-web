import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Node from 'ember-osf-web/models/node';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import Analytics from 'ember-osf-web/services/analytics';
import Ready from 'ember-osf-web/services/ready';

export default class GuidNodeForks extends Route {
    @service analytics!: Analytics;
    @service ready!: Ready;

    model() {
        return this.modelFor('guid-node');
    }

    @action
    async didTransition() {
        const { taskInstance } = this.controller.model as GuidRouteModel<Node>;
        await taskInstance;
        const node = taskInstance.value;
        this.analytics.trackPage(node ? node.public : undefined, 'nodes');
    }
}
