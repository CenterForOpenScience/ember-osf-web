import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import RegistrationProvider from 'ember-osf-web/models/registration-provider';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class RegistrationProviderSerializer extends ApplicationSerializer<RegistrationProvider> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/providers/registrations/${model.id}/`,
        };
    }

    buildRelationships(model: ModelInstance<RegistrationProvider>) {
        const relationships: SerializedRelationships<RegistrationProvider> = {
            licensesAcceptable: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/registrations/${model.id}/licenses/`,
                        meta: {},
                    },
                },
            },
            subjects: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/registrations/${model.id}/subjects/`,
                        meta: this.buildRelatedLinkMeta(model, 'subjects'),
                    },
                },
            },
        };

        if (model.brand) {
            relationships.brand = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/brands/${model.brand.id}/`,
                        meta: {},
                    },
                },
            };
        }

        return relationships;
    }
}
