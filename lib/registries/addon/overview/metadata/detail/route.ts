import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';


export default class MetadataDetailRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    async model(params: { recordId: string}) {
        let defaultIndex = 0;
        const parentModel = this.modelFor('overview.metadata');

        if (params.recordId) {
            let index = 1;
            for(const cedarMetadataRecord of parentModel.cedarMetadataRecords) {
                if (cedarMetadataRecord.id === params.recordId) {
                    defaultIndex = index++;
                }
            }
        }

        return {
            target: parentModel.target,
            cedarMetadataRecords: parentModel.cedarMetadataRecords,
            defaultIndex,
        };
    }
}
