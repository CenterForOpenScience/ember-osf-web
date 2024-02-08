import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

export default class MetadataDetailRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    async model(params: { recordId: string}) {
        const model = this.modelFor('guid-node.metadata');
        // const target = await guidNode.taskInstance;
        let defaultIndex = 0;

        /*
        const cedarMetadataRecords = await target.queryHasMany('cedarMetadataRecords', {
            // embed: 'template',
            'page[size]': 20,
        });
        */

        if (params.recordId) {
            let index = 1;
            for(const cedarMetadataRecord of model.cedarMetadataRecords) {
                // ((await cedarMetadataRecord.template) as CedarMetadataTemplateModel).recordCreated = true;
                if (cedarMetadataRecord.id === params.recordId) {
                    defaultIndex = index++;
                }
            }
        }

        return {
            target: model.target,
            cedarMetadataRecords: model.cedarMetadataRecords,
            defaultIndex,
        };
    }
}
