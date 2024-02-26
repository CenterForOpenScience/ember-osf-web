import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';


export default class MetadataDetailRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    async model() {
        const file = this.modelFor('guid-file');
        const defaultIndex = 0;
        const cedarMetadataRecords = await file.fileModel.queryHasMany('cedarMetadataRecords', {
            'page[size]': 20,
        });

        for(const cedarMetadataRecord of cedarMetadataRecords) {
            const template = await cedarMetadataRecord.template as CedarMetadataTemplateModel;
            template.recordCreated = true;
            cedarMetadataRecord.templateName = template.schemaName;
        }

        cedarMetadataRecords.sort(
            (a: CedarMetadataRecordModel, b: CedarMetadataRecordModel) =>
                a.templateName > b.templateName ? 1 : -1,
        );


        return {
            file,
            cedarMetadataRecords,
            defaultIndex,
        };
    }
}
