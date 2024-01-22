import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';


export default class MetadataDetailRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    async model(params: { recordId: string}) {
        const overviewModel = this.modelFor('overview');
        const target = await overviewModel.taskInstance;
        let defaultIndex = 0;
        const cedarMetadataRecords = await target.queryHasMany('cedarMetadataRecords', {
            'page[size]': 20,
        });

        // This is for prototyping to get a working view to the mirage server
        // This will be removed before production
        // Brian - 2024-01-09
        for(const item of cedarMetadataRecords) {
            await item.template;
        }

        if (params.recordId) {
            cedarMetadataRecords.map((cedarMetadataRecord: CedarMetadataRecordModel, index: number) => {
                if (cedarMetadataRecord.id === params.recordId) {
                    defaultIndex = index + 1;
                }
            });
        }

        return {
            target,
            cedarMetadataRecords,
            defaultIndex,
        };
    }
}
