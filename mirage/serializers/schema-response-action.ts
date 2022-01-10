import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import SchemaResponseActionModel from 'ember-osf-web/models/schema-response-action';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class SchemaResponseActionSerializer extends ApplicationSerializer<SchemaResponseActionModel> {
    buildRelationships(model: ModelInstance<SchemaResponseActionModel>) {
        const relationships: SerializedRelationships<SchemaResponseActionModel> = {
            target: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/revisions/${model.target.id}`,
                        meta: {},
                    },
                },
            },
            creator: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.creator.id}`,
                        meta: {},
                    },
                },
            },
        };
        return relationships;
    }
}
