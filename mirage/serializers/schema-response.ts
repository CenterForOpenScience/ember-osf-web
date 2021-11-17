import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import { MirageSchemaResponseModel } from '../factories/schema-response';
import ApplicationSerializer from './application';
const { OSF: { apiUrl } } = config;

export default class SchemaResponseSerializer extends ApplicationSerializer<MirageSchemaResponseModel> {
    buildNormalLinks(model: ModelInstance<MirageSchemaResponseModel>) {
        return {
            self: `${apiUrl}/v2/schema_responses/${model.id}`,
        };
    }

    buildRelationships(model: ModelInstance<MirageSchemaResponseModel>) {
        return {
            registrationSchema: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/schemas/registrations/${model.registrationSchema.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'registrationSchema'),
                    },
                },
            },
            registration: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.registration.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'registration'),
                    },
                },
            },
            initiatedBy: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.initiatedBy.id}`,
                        meta: this.buildRelatedLinkMeta(model, 'initiatedBy'),
                    },
                },
            },
            actions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/schema_responses/${model.id}/actions/`,
                    },
                },
            },
        };
    }
}
