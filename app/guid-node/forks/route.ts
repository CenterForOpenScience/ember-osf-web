import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

export default class GuidNodeForks extends Route.extend({
    async setupController(this: GuidNodeForks, controller): Promise<void> {
        this._super(...arguments);
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
    @service ready;
}
