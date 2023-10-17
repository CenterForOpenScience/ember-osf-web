import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';
import PreprintRequestActionModel from 'ember-osf-web/models/preprint-request-action';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class PreprintRequestActionSerializer extends ApplicationSerializer<PreprintRequestActionModel> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/actions/${model.id}`,
        };
    }

    buildRelationships(model: ModelInstance<PreprintRequestActionModel>) {
        const relationships: SerializedRelationships<PreprintRequestActionModel> = {
            creator: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.creator.id}`,
                        meta: {},
                    },
                },
            },
            target: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/requests/${model.target.id}`,
                        meta: {},
                    },
                },
            },
        };
        return relationships;
    }
}
