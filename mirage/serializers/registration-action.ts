import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import RegistrationActionModel from 'ember-osf-web/models/registration-action';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class RegistrationActionSerializer extends ApplicationSerializer<RegistrationActionModel> {
    buildNormalLinks(model: ModelInstance<RegistrationActionModel>) {
        return {
            self: `${apiUrl}/v2/providers/registrations/${model.provider.id}/actions/${model.id}`,
        };
    }

    buildRelationships(model: ModelInstance<RegistrationActionModel>) {
        const relationships: SerializedRelationships<RegistrationActionModel> = {
            provider: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/registrations/${model.provider.id}`,
                        meta: {},
                    },
                },
            },
            target: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.target.id}`,
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
