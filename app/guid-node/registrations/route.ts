import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { taskFor } from 'ember-concurrency-ts';

import Node from 'ember-osf-web/models/node';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import Analytics from 'ember-osf-web/services/analytics';

import Controller from './controller';

export default class GuidNodeRegistrations extends Route {
    @service analytics!: Analytics;

    model() {
        return this.modelFor('guid-node') as GuidRouteModel<Node>;
    }

    setupController(controller: Controller, model: GuidRouteModel<Node>, transition: Transition): void {
        super.setupController(controller, model, transition);
        taskFor(controller.getRegistrationSchemas).perform();
    }

    @action
    async didTransition() {
        const { taskInstance } = this.controller.model as GuidRouteModel<Node>;
        await taskInstance;
        const node = taskInstance.value;
        this.analytics.trackPage(node ? node.public : undefined, 'nodes');
    }
}
