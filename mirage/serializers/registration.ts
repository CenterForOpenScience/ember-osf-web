import { ID, ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Registration from 'ember-osf-web/models/registration';

import ApplicationSerializer, { SerializedRelationships } from './application';
import { NodeAttrs } from './node';

const { OSF: { apiUrl } } = config;

interface RegistrationAttrs extends NodeAttrs {
    registeredFromId: ID | null;
    registrationSchemaId: ID | null;
    providerId: ID | null;
}

type MirageRegistration = Registration & { attrs: RegistrationAttrs };

export default class RegistrationSerializer extends ApplicationSerializer<MirageRegistration> {
    buildRelationships(model: ModelInstance<MirageRegistration>) {
        const relationships: SerializedRelationships<MirageRegistration> = {
            linkedNodes: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/linked_nodes/`,
                        meta: this.buildRelatedLinkMeta(model, 'linkedNodes'),
                    },
                    self: {
                        href: `${apiUrl}/v2/registrations/${model.id}/relationships/linked_nodes/`,
                        meta: {},
                    },
                },
            },
            linkedRegistrations: {
                links: {
                    self: {
                        href: `${apiUrl}/v2/registrations/${model.id}/relationships/linked_registrations/`,
                        meta: {},
                    },
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/linked_registrations/`,
                        meta: this.buildRelatedLinkMeta(model, 'linkedRegistrations'),
                    },
                },
            },
            contributors: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/contributors/`,
                        meta: this.buildRelatedLinkMeta(model, 'contributors'),
                    },
                },
            },
            bibliographicContributors: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/bibliographic_contributors/`,
                        meta: this.buildRelatedLinkMeta(model, 'bibliographicContributors'),
                    },
                },
            },
            affiliatedInstitutions: {
                links: {
                    self: {
                        href: `${apiUrl}/v2/registrations/${model.id}/relationships/institutions/`,
                        meta: {},
                    },
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/institutions/`,
                        meta: this.buildRelatedLinkMeta(model, 'affiliatedInstitutions'),
                    },
                },
            },
            comments: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/comments/?filter[targetID]=${model.id}`,
                        meta: this.buildRelatedLinkMeta(model, 'comments'),
                    },
                },
            },
            children: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/children/`,
                        meta: this.buildRelatedLinkMeta(model, 'children'),
                    },
                },
            },
            forks: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/forks/`,
                        meta: this.buildRelatedLinkMeta(model, 'forks'),
                    },
                },
            },
            citation: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/citation/`,
                        meta: {},
                    },
                },
            },
            identifiers: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/identifiers/`,
                        meta: this.buildRelatedLinkMeta(model, 'identifiers'),
                    },
                },
            },
            subjects: {
                links: {
                    self: {
                        href: `${apiUrl}/v2/registrations/${model.id}/relationships/subjects/`,
                        meta: {},
                    },
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/subjects/`,
                        meta: this.buildRelatedLinkMeta(model, 'subjects'),
                    },
                },
            },
            reviewActions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/actions/`,
                        meta: this.buildRelatedLinkMeta(model, 'reviewActions'),
                    },
                },
            },
            revisions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/revisions/`,
                        meta: this.buildRelatedLinkMeta(model, 'revisions'),
                    },
                },
            },
        };

        if (model.registeredBy) {
            relationships.registeredBy = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.registeredBy.id}`,
                        meta: {},
                    },
                },
                data: {
                    id: `${model.registeredBy.id}`,
                    type: 'users',
                },
            };
        }

        if (model.attrs.providerId) {
            const { providerId } = model.attrs;
            relationships.provider = {
                data: {
                    id: providerId as string,
                    type: 'registration-providers',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/registrations/${providerId}/`,
                        meta: {},
                    },
                },
            };
        }

        if (model.attrs.parentId !== null) {
            const { parentId } = model.attrs;
            relationships.parent = {
                data: {
                    id: parentId as string,
                    type: this.typeKeyForModel(model),
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${parentId}`,
                        meta: {},
                    },
                },
            };
        }
        if (model.attrs.rootId !== null) {
            const { rootId } = model.attrs;
            relationships.root = {
                data: {
                    id: rootId as string,
                    type: this.typeKeyForModel(model),
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${rootId}`,
                        meta: {},
                    },
                },
            };
        }
        if (model.attrs.registeredFromId !== null) {
            const { registeredFromId } = model.attrs;
            relationships.registeredFrom = {
                data: {
                    id: registeredFromId as string,
                    type: 'nodes',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${registeredFromId}`,
                        meta: {},
                    },
                },
            };
        }
        if (model.attrs.registrationSchemaId !== null) {
            const { registrationSchemaId } = model.attrs;
            relationships.registrationSchema = {
                data: {
                    id: registrationSchemaId as string,
                    type: 'registration_schemas',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/schemas/registrations/${registrationSchemaId}`,
                        meta: {},
                    },
                },
            };
        }
        if (model.attrs.licenseId !== null) {
            const { licenseId } = model.attrs;
            relationships.license = {
                data: {
                    id: licenseId as string,
                    type: 'licenses',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/licenses/${licenseId}`,
                        meta: {},
                    },
                },
            };
        }
        return relationships;
    }

    buildApiMeta(model: ModelInstance<MirageRegistration>) {
        return {
            ...super.buildApiMeta(model),
            ...(model.attrs._anonymized ? { anonymous: true } : {}),
        };
    }
}
