import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class DraftRegistrationSerializer extends ApplicationSerializer<DraftRegistration> {
    buildRelationships(model: ModelInstance<DraftRegistration>) {
        const returnValue: SerializedRelationships<DraftRegistration> = {
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
            affiliatedInstitutions: {
                links: {
                    self: {
                        href: `${apiUrl}/v2/draft_registrations/${model.id}/relationships/institutions/`,
                        meta: {},
                    },
                    related: {
                        href: `${apiUrl}/v2/draft_registrations/${model.id}/institutions/`,
                        meta: this.buildRelatedLinkMeta(model, 'affiliatedInstitutions'),
                    },
                },
            },
            subjects: {
                links: {
                    self: {
                        href: `${apiUrl}/v2/draft_registrations/${model.id}/relationships/subjects/`,
                        meta: {},
                    },
                    related: {
                        href: `${apiUrl}/v2/draft_registrations/${model.id}/subjects`,
                        meta: this.buildRelatedLinkMeta(model, 'subjects'),
                    },
                },
            },
            contributors: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/draft_registrations/${model.id}/contributors`,
                        meta: this.buildRelatedLinkMeta(model, 'contributors'),
                    },
                },
            },
            bibliographicContributors: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/draft_registrations/${model.id}/bibliographic_contributors`,
                        meta: this.buildRelatedLinkMeta(model, 'bibliographicContributors'),
                    },
                },
            },
        };
        if (model.branchedFrom) {
            returnValue.branchedFrom = {
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
            };
        }
        if (model.license) {
            returnValue.license = {
                data: {
                    id: model.license.id,
                    type: 'licenses',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/licenses/${model.license.id}`,
                        meta: {},
                    },
                },
            };
        }
        return returnValue;
    }

    buildNormalLinks(model: ModelInstance<DraftRegistration>) {
        return {
            self: `${apiUrl}/v2/draft_registrations/${model.id}`,
        };
    }
}
