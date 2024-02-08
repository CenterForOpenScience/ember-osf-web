import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

export default class MetadataDetailRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    async model(params: { recordId: string}) {
        const parentModel = this.modelFor('guid-node.metadata');
        let defaultIndex = 0;

        if (params.recordId) {
            let index = 0;
            for(const cedarMetadataRecord of parentModel.cedarMetadataRecords) {
                if (cedarMetadataRecord.id === params.recordId) {
                    defaultIndex = index + 1;
                }
                index++;
            }
        }

        return {
            target: parentModel.target,
            cedarMetadataRecords: parentModel.cedarMetadataRecords,
            defaultIndex,
        };
    }
}
