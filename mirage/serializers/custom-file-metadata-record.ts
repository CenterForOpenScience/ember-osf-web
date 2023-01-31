import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import CustomFileMetadataRecord from 'ember-osf-web/models/custom-file-metadata-record';
import ApplicationSerializer from './application';
const { OSF: { apiUrl } } = config;

export default class SchemaResponseSerializer extends ApplicationSerializer<CustomFileMetadataRecord> {
    buildNormalLinks(model: ModelInstance<CustomFileMetadataRecord>) {
        return {
            self: `${apiUrl}/v2/custom_file_metadata_records/${model.id}/`,
        };
    }

    buildRelationships(model: ModelInstance<CustomFileMetadataRecord>) {
        return {
            guid: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/guids/${model.id}/`,
                    },
                },
            },
        };
    }
}
