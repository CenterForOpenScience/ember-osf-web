import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import NodeRequestActionModel from 'ember-osf-web/models/node-request-action';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class NodeRequestActionSerializer extends ApplicationSerializer<NodeRequestActionModel> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/providers/registrations/${model.provider.id}/actions/${model.id}`,
        };
    }

    buildRelationships(model: ModelInstance<NodeRequestActionModel>) {
        const relationships: SerializedRelationships<NodeRequestActionModel> = {
            provider: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/registrations/${model.provider.id}`,
                        meta: {},
                    },
                },
            },
            target: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.target.id}`,
                        meta: {},
                    },
                },
            },
            creator: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.creator.id}`,
                        meta: {},
                    },
                },
            },
        };
        return relationships;
    }
}
