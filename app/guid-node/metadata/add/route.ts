import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import GuidMetadataAdd from 'ember-osf-web/guid-node/metadata/add/controller';


export default class GuidMetadataAddRoute extends Route {
    @service store!: Store;

    async model() {
        const params = this.modelFor('guid-node.metadata');

        const templates = await this.store.findAll('cedar-metadata-template', {
            adapterOptions: { sort: 'schema_name' },
        });

        return {
            target: params.guidNode,
            templates,
        };
    }

    deactivate() {
        (this.controller as GuidMetadataAdd).displaySelectionOptions = true;
    }
}
