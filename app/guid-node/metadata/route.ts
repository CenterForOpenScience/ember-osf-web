import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';


export default class MetadataRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    async model() {
        const guidNode = await this.modelFor('guid-node').taskInstance;

        return {
            guidNode,
        };
    }
}
