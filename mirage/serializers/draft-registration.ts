import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class DraftRegistrationSerializer extends ApplicationSerializer<DraftRegistration> {
    buildRelationships(model: ModelInstance<DraftRegistration>) {
        return {
            branchedFrom: {
                data: {
                    id: model.branchedFrom.id,
                    type: 'nodes',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.branchedFrom.id}`,
                        meta: {},
                    },
                },
            },
            initiator: {
                data: {
                    id: model.initiator.id,
                    type: 'users',
                },
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
            provider: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/registrations/${model.provider.id}`,
                        meta: {},
                    },
                },
            },
            subjects: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/draft_registrations/${model.id}/subjects`,
                        meta: {},
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<DraftRegistration>) {
        return {
            self: `${apiUrl}/v2/draft_registrations/${model.id}`,
        };
    }
}
