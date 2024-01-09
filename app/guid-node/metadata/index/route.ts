import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';


export default class MetadataRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    async model() {
        const params = this.modelFor('guid-node.metadata');

        const records = await params.guidNode.queryHasMany('cedarMetadataRecords', {
            'page[size]': 20,
        });

        // This is for prototyping to get a working view to the mirage server
        // This will be removed before production
        // Brian - 2024-01-09
        for(const item of records) {
            await item.template;
        }

        return {
            guidNode: params.guidNode,
            records,
        };
    }
}
