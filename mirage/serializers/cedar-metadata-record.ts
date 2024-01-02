import { ModelInstance } from 'ember-cli-mirage';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import config from 'ember-osf-web/config/environment';
import ApplicationSerializer from './application';
const { OSF: { apiUrl } } = config;

export default class CedarMetadataRecordMirageSerializer extends ApplicationSerializer<CedarMetadataRecordModel> {
    buildNormalLinks(model: ModelInstance<CedarMetadataRecordModel>) {
        return {
            self: `${apiUrl}/_/cedar_metadata_records/${model.id}/`,
        };
    }
}
