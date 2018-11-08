import { ID, ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import Node from 'ember-osf-web/models/registration';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export interface Attrs {
    parentId: ID | null;
    rootId: ID | null;
}

type MirageNode = Node & { attrs: Attrs };

export default class NodeSerializer extends ApplicationSerializer<MirageNode> {
    buildRelationships(model: ModelInstance<MirageNode>) {
        const relationships: SerializedRelationships<Node> = {
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
            linkedRegistrations: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/linked_registrations/`,
                        meta: this.buildRelatedLinkMeta(model, 'linkedRegistrations'),
                    },
                    self: {
                        href: `${apiUrl}/v2/nodes/${model.id}/relationships/linked_registrations/`,
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
            children: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/children/`,
                        meta: this.buildRelatedLinkMeta(model, 'children'),
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
            registrations: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/registrations/`,
                        meta: this.buildRelatedLinkMeta(model, 'registrations'),
                    },
                },
            },
            draftRegistrations: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}/draft_registrations/`,
                        meta: this.buildRelatedLinkMeta(model, 'draftRegistrations'),
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

    buildNormalLinks(model: ModelInstance<MirageNode>) {
        return {
            ...super.buildNormalLinks(model),
            html: `/${model.id}/`,
        };
    }
}
