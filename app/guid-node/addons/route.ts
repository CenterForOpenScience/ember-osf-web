import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';

export default class GuidNodeAddons extends Route {
    @service store: Store;

    async model() {
        return await this.modelFor('guid-node').taskInstance;
    }
}
