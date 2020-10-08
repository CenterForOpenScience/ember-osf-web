import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import ReviewActionModel from 'ember-osf-web/models/review-action';
import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class ReviewActionSerializer extends ApplicationSerializer<ReviewActionModel> {
    buildNormalLinks(model: ModelInstance<ReviewActionModel>) {
        return {
            self: `${apiUrl}/v2/providers/registrations/${model.provider.id}/actions/${model.id}`,
        };
    }

    buildRelationships(model: ModelInstance<ReviewActionModel>) {
        const relationships: SerializedRelationships<ReviewActionModel> = {
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
