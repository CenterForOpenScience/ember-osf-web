import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';
import RegistrationSchema from 'ember-osf-web/models/registration-schema';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class RegistrationSchemaSerializer extends ApplicationSerializer<RegistrationSchema> {
    keyForAttribute(attr: string) {
        if (attr === 'schemaNoConflict') {
            return 'schema';
        }
        return super.keyForAttribute(attr);
    }

    buildRelationships(model: ModelInstance<RegistrationSchema>) {
        const relationships: SerializedRelationships<RegistrationSchema> = {
            schemaBlocks: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/schemas/registrations/${model.id}/schema_blocks/`,
                        meta: this.buildRelatedLinkMeta(model, 'schemaBlocks'),
                    },
                },
            },
        };
        return relationships;
    }
}
