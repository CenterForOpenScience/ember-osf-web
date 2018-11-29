import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Registration from 'ember-osf-web/models/registration';

import ApplicationSerializer, { SerializedRelationships } from './application';
import { Attrs } from './node';

const { OSF: { apiUrl } } = config;

type MirageRegistration = Registration & { attrs: Attrs };

export default class RegistrationSerializer extends ApplicationSerializer<MirageRegistration> {
    buildRelationships(model: ModelInstance<MirageRegistration>) {
        const relationships: SerializedRelationships<MirageRegistration> = {
            linkedNodes: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/linked_nodes/`,
                        meta: this.buildRelatedLinkMeta(model, 'linkedNodes'),
                    },
                    self: {
                        href: `${apiUrl}/v2/nodes/${model.id}/relationships/linked_nodes/`,
                        meta: {},
                    },
                },
            },
            contributors: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/contributors/`,
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
            forks: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/forks/`,
                        meta: this.buildRelatedLinkMeta(model, 'forks'),
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
        if (model.attrs.parentId !== null) {
            const { parentId } = model.attrs;
            relationships.parent = {
                data: {
                    id: parentId,
                    type: this.typeKeyForModel(model),
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${parentId}`,
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
                        href: `${apiUrl}/v2/nodes/${rootId}`,
                        meta: {},
                    },
                },
            };
        }
        return relationships;
    }
}
