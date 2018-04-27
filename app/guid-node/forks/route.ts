import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import GuidNodeForksController from 'ember-osf-web/guid-node/forks/controller';
import Ready from 'ember-osf-web/services/ready';

export default class GuidNodeForks extends Route.extend({
    async setupController(this: GuidNodeForks, controller: GuidNodeForksController, ...args: any[]): Promise<void> {
        this._super(controller, ...args);
        const blocker = this.get('ready').getBlocker();
        controller.set('page', 1);
        try {
            await controller.get('getForks').perform();
            blocker.done();
        } catch (e) {
            blocker.errored(e);
        }
    },
}) {
    @service ready!: Ready;
    model(this: GuidNodeForks) {
        return this.modelFor('guid-node');
    }
}
