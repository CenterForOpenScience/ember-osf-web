import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
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
            ((await cedarMetadataRecord.template) as CedarMetadataTemplateModel).recordCreated = true;
        }
        return {
            file,
            cedarMetadataRecords,
            defaultIndex,
        };
    }
}
