import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';
import { MirageLogModel } from 'ember-osf-web/mirage/factories/log';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;


export default class LogSerializer extends ApplicationSerializer<MirageLogModel> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/logs/${model.id}/`,
            iri: `${apiUrl}/v2/logs/${model.id}/`,
        };
    }

    buildRelationships(model: ModelInstance<MirageLogModel>) {
        const relationships: SerializedRelationships<MirageLogModel> = {
            user: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.userId}`,
                        meta: {},
                    },
                },
            },

        };

        if (model.linkedNode) {
            relationships.linkedNode = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.linkedNodeId}`,
                        meta: {},
                    },
                },
            };
        }

        if (model.node) {
            relationships.node = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.nodeId}`,
                        meta: {},
                    },
                },
            };
        }

        return relationships;
    }
}
