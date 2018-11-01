import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import Node from 'ember-osf-web/models/node';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import Analytics from 'ember-osf-web/services/analytics';

import Controller from './controller';

export default class GuidNodeRegistrations extends Route {
    @service analytics!: Analytics;

    model(this: GuidNodeRegistrations) {
        return this.modelFor('guid-node') as GuidRouteModel<Node>;
    }

    setupController(controller: Controller, model: GuidRouteModel<Node>): void {
        super.setupController(controller, model);
        controller.get('getRegistrationSchemas').perform();
    }

    @action
    didTransition() {
        this.analytics.trackPage(true);
    }
}
