import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default class GuidMetadataAddRoute extends Route {
    @service store!: Store;

    async model() {
        const templates = await this.store.findAll('cedar-metadata-template', {
            adapterOptions: { sort: 'schema_name' },
        });

        return {
            templates,
        };
    }
}
