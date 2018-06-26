import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import featureFlagRoute from 'ember-osf-web/decorators/feature-flag-route';
import GuidNodeForksController from 'ember-osf-web/guid-node/forks/controller';
import Ready from 'ember-osf-web/services/ready';

@featureFlagRoute()
export default class GuidNodeForks extends Route {
    @service ready!: Ready;

    model(this: GuidNodeForks) {
        return this.modelFor('guid-node');
    }

    async setupController(this: GuidNodeForks, controller: GuidNodeForksController, model: any): Promise<void> {
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
