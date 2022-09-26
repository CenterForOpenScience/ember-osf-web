import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { taskFor } from 'ember-concurrency-ts';

import Node from 'ember-osf-web/models/node';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';

import Controller from './controller';

export default class GuidNodeRegistrations extends Route {
    model() {
        return this.modelFor('guid-node') as GuidRouteModel<Node>;
    }

    setupController(controller: Controller, model: GuidRouteModel<Node>, transition: Transition): void {
        super.setupController(controller, model, transition);
        taskFor(controller.getRegistrationSchemas).perform();
    }
}
