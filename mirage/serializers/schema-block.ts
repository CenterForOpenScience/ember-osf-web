import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';
import SchemaBlockModel from 'ember-osf-web/models/schema-block';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class SchemaBlockSerializer extends ApplicationSerializer<SchemaBlockModel> {
    buildRelationships(model: ModelInstance<SchemaBlockModel>) {
        const relationships: SerializedRelationships<SchemaBlockModel> = {
            schema: {
                data: {
                    id: model.schema!.id,
                    type: 'registration-schema',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/schemas/registrations/${model.schema!.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'schema'),
                    },
                },
            },
        };
        return relationships;
    }
}
