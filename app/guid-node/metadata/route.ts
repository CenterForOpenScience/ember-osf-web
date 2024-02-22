import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

export default class MetadataDetailRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    async model() {
        const guidNode = this.modelFor('guid-node');
        const target = await guidNode.taskInstance;

        return {
            target,
        };
    }
}
