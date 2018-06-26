import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import GuidRegistrationForksController from 'ember-osf-web/guid-registration/forks/controller';
import Ready from 'ember-osf-web/services/ready';

export default class GuidRegistrationForks extends Route {
    @service ready!: Ready;

    model(this: GuidRegistrationForks) {
        return this.modelFor('guid-registration');
    }

    async setupController(
        this: GuidRegistrationForks, controller: GuidRegistrationForksController, model: any,
    ): Promise<void> {
        super.setupController(controller, model);
        const blocker = this.get('ready').getBlocker();
        controller.set('page', 1);
        try {
            await controller.get('getForks').perform();
            blocker.done();
        } catch (e) {
            blocker.errored(e);
        }
    }
}
