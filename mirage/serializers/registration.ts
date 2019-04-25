import { ID, ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Registration from 'ember-osf-web/models/registration';

import ApplicationSerializer, { SerializedRelationships } from './application';
import { NodeAttrs } from './node';

const { OSF: { apiUrl } } = config;

interface RegistrationAttrs extends NodeAttrs {
    registeredFromId: ID | null;
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
            registrationSchema: {
                data: {
                    id: model.registrationSchema.id,
                    type: 'registration_schemas',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/schemas/registrations/${model.registrationSchema.id}`,
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
        };
        if (model.attrs.parentId !== null) {
            const { parentId } = model.attrs;
            relationships.parent = {
                data: {
                    id: parentId,
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
                    id: rootId,
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
                    id: registeredFromId,
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
        if (model.attrs.licenseId !== null) {
            const { licenseId } = model.attrs;
            relationships.license = {
                data: {
                    id: licenseId,
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
}
