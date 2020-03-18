import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import RegistrationProvider from 'ember-osf-web/models/registration-provider';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class RegistrationProviderSerializer extends ApplicationSerializer<RegistrationProvider> {
    buildRelationships(model: ModelInstance<RegistrationProvider>) {
        return {
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
            brand: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/registrations/${model.id}/brand/`,
                        meta: {},
                    },
                },
            },
        };
    }
}
