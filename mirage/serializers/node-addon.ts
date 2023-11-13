import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import NodeAddonModel from 'ember-osf-web/models/node-addon';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class NodeAddonSerializer extends ApplicationSerializer<NodeAddonModel> {
    buildRelationships(model: ModelInstance<NodeAddonModel>) {
        return {
            node: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.node.id}`,
                        meta: this.buildRelatedLinkMeta(model, 'node'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<NodeAddonModel>) {
        return {
            self: `${apiUrl}/v2/nodes/${model.node.id}/addons/${model.id}`,
        };
    }
}
