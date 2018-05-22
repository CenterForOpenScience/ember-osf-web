import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import GuidNodeRegistrationsController from 'ember-osf-web/guid-node/registrations/controller';
import Ready from 'ember-osf-web/services/ready';

export default class GuidNodeRegistrations extends Route {
    @service ready!: Ready;

    model(this: GuidNodeRegistrations) {
        return this.modelFor('guid-node');
    }

    async setupController(this: GuidNodeRegistrations, controller: GuidNodeRegistrationsController, model: any): Promise<void> {
        super.setupController(controller, model);
        const blocker = this.get('ready').getBlocker();
        controller.set('page', 1);
        try {
            controller.get('getDrafts').perform();
            await controller.get('getRegistrations').perform();
            blocker.done();
        } catch (e) {
            blocker.errored(e);
        }
    }
}
