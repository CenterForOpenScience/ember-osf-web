import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';
import PreprintRequestModel from 'ember-osf-web/models/preprint-request';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class PreprintRequestSerializer extends ApplicationSerializer<PreprintRequestModel> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/requests/${model.id}`,
        };
    }

    buildRelationships(model: ModelInstance<PreprintRequestModel>) {
        const relationships: SerializedRelationships<PreprintRequestModel> = {
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
                        href: `${apiUrl}/v2/preprints/${model.target.id}`,
                        meta: {},
                    },
                },
            },
            actions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/requests/${model.id}/actions`,
                        meta: {},
                    },
                },
            },
        };
        return relationships;
    }
}
