import { ID, ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Registration from 'ember-osf-web/models/registration';

import ApplicationSerializer, { SerializedRelationships } from './application';
import { Attrs as NodeAttrs } from './node';

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
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.id}/linked_registrations/`,
                        meta: this.buildRelatedLinkMeta(model, 'linkedRegistrations'),
                    },
                    self: {
                        href: `${apiUrl}/v2/registrations/${model.id}/relationships/linked_registrations/`,
                        meta: {},
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
                    type: this.typeKeyForModel(model),
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${registeredFromId}`,
                        meta: {},
                    },
                },
            };
        }
        return relationships;
    }
}
