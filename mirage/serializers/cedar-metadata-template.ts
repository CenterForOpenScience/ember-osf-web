import { ModelInstance } from 'ember-cli-mirage';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';
import config from 'ember-osf-web/config/environment';
import ApplicationSerializer from './application';
const { OSF: { apiUrl } } = config;

export default class CedarMetadataTemplateMirageSerializer extends ApplicationSerializer<CedarMetadataTemplateModel> {
    buildNormalLinks(model: ModelInstance<CedarMetadataTemplateModel>) {
        return {
            self: `${apiUrl}/_/cedar_metadata_templates/${model.id}`,
        };
    }
}
