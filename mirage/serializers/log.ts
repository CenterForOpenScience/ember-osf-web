import { ModelInstance } from 'ember-cli-mirage';
import LogModel from 'ember-osf-web/models/log';
import config from 'ember-osf-web/config/environment';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;


export default class LogSerializer extends ApplicationSerializer<LogModel> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/registrations/${model.id}/`,
        };
    }

    buildRelationships(model: ModelInstance<LogModel>) {
        const relationships: SerializedRelationships<LogModel> = {
            node: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.id}`,
                        meta: this.buildRelatedLinkMeta(model, 'node'),
                    },
                },
            },
            user: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.user.id}`,
                        meta: {},
                    },
                },
            },

        };

        return relationships;
    }
}
