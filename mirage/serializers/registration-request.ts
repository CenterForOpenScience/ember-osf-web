import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import RegistrationRequestModel from 'ember-osf-web/models/registration-request';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class RegistrationRequestSerializer extends ApplicationSerializer<RegistrationRequestModel> {
    buildNormalLinks(model: ModelInstance<RegistrationRequestModel>) {
        return {
            self: `${apiUrl}/v2/providers/registrations/${model.target.provider.id}/requests/${model.id}`,
        };
    }

    buildRelationships(model: ModelInstance<RegistrationRequestModel>) {
        const relationships: SerializedRelationships<RegistrationRequestModel> = {
            creator: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.creator.id}`,
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
        };
        return relationships;
    }
}
