import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';
import config from 'ember-osf-web/config/environment';
import ApplicationSerializer from './application';
const { OSF: { apiUrl } } = config;

export default class CedarMetadataTemplateMirageSerializer extends ApplicationSerializer<CedarMetadataTemplateModel> {
    buildNormalLinks() {
        return {
            self: `${apiUrl}/_/cedar_metadata_templates/`,
        };
    }
}
