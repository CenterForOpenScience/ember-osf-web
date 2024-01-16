import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';


export default class MetadataDetailRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    async model() {
        const params = this.modelFor('guid-node');
        const target = await params.taskInstance;
        const cedarMetadataRecords = await target.queryHasMany('cedarMetadataRecords', {
            'page[size]': 20,
        });

        // This is for prototyping to get a working view to the mirage server
        // This will be removed before production
        // Brian - 2024-01-09
        for(const item of cedarMetadataRecords) {
            await item.template;
        }

        return {
            target,
            cedarMetadataRecords,
        };
    }
}
