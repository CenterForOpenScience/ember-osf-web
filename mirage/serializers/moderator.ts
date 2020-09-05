import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import ModeratorModel from 'ember-osf-web/models/moderator';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class ModeratorSerializer extends ApplicationSerializer<ModeratorModel> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/providers/registrations/${model.provider.id}/moderators/${model.id}`,
        };
    }

    buildRelationships(model: ModelInstance<ModeratorModel>) {
        const relationships: SerializedRelationships<ModeratorModel> = {};
        if (model.user) {
            relationships.user = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.user.id}`,
                        meta: {},
                    },
                },
            };
        }
        if (model.provider) {
            relationships.provider = {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/registrations/${model.provider.id}`,
                    },
                },
            };
        }
        return relationships;
    }
}
