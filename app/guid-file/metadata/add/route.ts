import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import GuidMetadataAdd from 'ember-osf-web/guid-node/metadata/add/controller';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';


export default class GuidMetadataAddRoute extends Route {
    @service store!: Store;

    async model() {
        const file = this.modelFor('guid-file');
        const templates = await this.store.query('cedar-metadata-template', {
            adapterOptions: { sort: 'schema_name' },
        });

        const cedarMetadataRecords = await file.fileModel.queryHasMany('cedarMetadataRecords', {
            'page[size]': 20,
        });

        for(const cedarMetadataRecord of cedarMetadataRecords) {
            const template = await cedarMetadataRecord.template as CedarMetadataTemplateModel;
            template.recordCreated = true;
            cedarMetadataRecord.templateName = template.schemaName;
        }

        return {
            target: file,
            templates,
        };
    }

    deactivate() {
        (this.controller as GuidMetadataAdd).displaySelectionOptions = true;
    }
}
