import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import CustomItemMetadataRecord from 'ember-osf-web/models/custom-item-metadata-record';
import ApplicationSerializer from './application';
const { OSF: { apiUrl } } = config;

export default class SchemaResponseSerializer extends ApplicationSerializer<CustomItemMetadataRecord> {
    buildNormalLinks(model: ModelInstance<CustomItemMetadataRecord>) {
        return {
            self: `${apiUrl}/v2/custom_file_metadata_records/${model.id}/`,
        };
    }

    buildRelationships(model: ModelInstance<CustomItemMetadataRecord>) {
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
