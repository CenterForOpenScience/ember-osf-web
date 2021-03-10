import { underscore } from '@ember/string';
import { ID, ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import { pluralize } from 'ember-inflector';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export interface BranchedFromId {
    type: string;
    id: ID;
}
interface DraftRegistrationAttrs {
    branchedFromId: BranchedFromId;
}

type MirageDraftRegistration = DraftRegistration & DraftRegistrationAttrs;

export default class DraftRegistrationSerializer extends ApplicationSerializer<MirageDraftRegistration> {
    buildRelationships(model: ModelInstance<MirageDraftRegistration>) {
        const relationships: SerializedRelationships<MirageDraftRegistration> = {
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
                        href: `${apiUrl}/v2/draft_registrations/${model.id}/contributors/`,
                        meta: this.buildRelatedLinkMeta(model, 'contributors'),
                    },
                },
            },
            bibliographicContributors: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/draft_registrations/${model.id}/bibliographic_contributors/`,
                        meta: this.buildRelatedLinkMeta(model, 'bibliographicContributors'),
                    },
                },
            },
        };

        if (model.branchedFrom) {
            const pathName = pluralize(underscore(model.branchedFromId.type));
            relationships.branchedFrom = {
                data: {
                    id: model.branchedFromId.id,
                    type: model.branchedFromId.type,
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/${pathName}/${model.branchedFromId.id}`,
                        meta: {},
                    },
                },
            };
        }

        if (model.license) {
            relationships.license = {
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

        return relationships;
    }

    buildNormalLinks(model: ModelInstance<MirageDraftRegistration>) {
        return {
            self: `${apiUrl}/v2/draft_registrations/${model.id}`,
        };
    }
}
