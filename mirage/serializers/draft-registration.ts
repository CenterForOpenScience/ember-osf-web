import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class DraftRegistrationSerializer extends ApplicationSerializer<DraftRegistration> {
    buildRelationships(model: ModelInstance<DraftRegistration>) {
        return {
            branchedFrom: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.branchedFrom.id}`,
                        meta: {},
                    },
                },
            },
            initiator: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.initiator.id}`,
                        meta: {},
                    },
                },
            },
            registrationSchema: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/schemas/registrations/${model.registrationSchema.id}`,
                        meta: {},
                    },
                },
            },
        };
    }
}
