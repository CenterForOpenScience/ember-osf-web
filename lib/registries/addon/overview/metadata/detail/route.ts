import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';


export default class MetadataDetailRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    async model(params: { recordId: string}) {
        const parentModel = this.modelFor('overview.metadata');
        let defaultIndex = 0;

        parentModel.cedarMetadataRecords.sort(
            (a: CedarMetadataRecordModel, b: CedarMetadataRecordModel) =>
                a.templateName > b.templateName ? 1 : -1,
        );

        if (params.recordId) {
            let index = 0;
            for(const cedarMetadataRecord of parentModel.cedarMetadataRecords) {
                if (cedarMetadataRecord.id === params.recordId) {
                    defaultIndex = index + 1;
                }
                index++;
            }
        }

        if (defaultIndex > 0) {
            const selected = parentModel.cedarMetadataRecords.splice(defaultIndex - 1, 1);
            parentModel.cedarMetadataRecords.unshift(selected[0]);
            defaultIndex = 1;
        }

        return {
            target: parentModel.target,
            cedarMetadataRecords: parentModel.cedarMetadataRecords,
            defaultIndex,
        };
    }
}
