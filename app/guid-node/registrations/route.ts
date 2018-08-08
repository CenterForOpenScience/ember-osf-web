import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import { GuidNodeModel } from 'ember-osf-web/guid-node/route';
import Analytics from 'ember-osf-web/services/analytics';

import Controller from './controller';

export default class GuidNodeRegistrations extends Route {
    @service analytics!: Analytics;

    model(this: GuidNodeRegistrations) {
        return this.modelFor('guid-node') as GuidNodeModel;
    }

    setupController(controller: Controller, model: GuidNodeModel): void {
        super.setupController(controller, model);
        controller.get('getRegistrationSchemas').perform();
    }

    @action
    didTransition() {
        this.analytics.trackPage(true);
    }
}
