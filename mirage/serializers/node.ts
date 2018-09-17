import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import Node from 'ember-osf-web/models/registration';
import ApplicationSerializer, { SerializedLinks } from './application';

const { OSF: { apiUrl } } = config;

export default class NodeSerializer extends ApplicationSerializer {
    links(model: Node & { attrs: any }) {
        const returnValue: SerializedLinks<Node> = {
            linkedNodes: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.id}/linked_nodes/`,
                    meta: this.buildRelatedLinkMeta(model, 'linkedNodes'),
                },
                self: {
                    href: `${apiUrl}/v2/nodes/${model.id}/relationships/linked_nodes/`,
                    meta: {},
                },
            },
            contributors: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.id}/contributors/`,
                    meta: this.buildRelatedLinkMeta(model, 'contributors'),
                },
            },
            forks: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.id}/forks/`,
                    meta: this.buildRelatedLinkMeta(model, 'forks'),
                },
            },
            registrations: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.id}/registrations/`,
                    meta: this.buildRelatedLinkMeta(model, 'registrations'),
                },
            },
            draftRegistrations: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.id}/draft_registrations/`,
                    meta: this.buildRelatedLinkMeta(model, 'draftRegistrations'),
                },
            },
        };
        if (model.attrs.parentId !== null) {
            returnValue.parent = {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.attrs.parentId}`,
                    meta: {},
                },
            };
        }
        if (model.attrs.rootId !== null) {
            returnValue.root = {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.attrs.rootId}`,
                    meta: {},
                },
            };
        }
        return returnValue;
    }
    buildNormalLinks(model: ModelInstance<Node>) {
        return {
            self: `${apiUrl}/v2/nodes/${model.id}/`,
            html: `/${model.id}/`,
        };
    }
}
