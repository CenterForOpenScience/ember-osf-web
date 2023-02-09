import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class CollectionProviderSerializer extends ApplicationSerializer<CollectionProvider> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/providers/collections/${model.id}/`,
        };
    }
    buildRelationships(model: ModelInstance<CollectionProvider>) {
        return {
            licensesAcceptable: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/collections/${model.id}/licenses/`,
                    },
                },
            },
            primaryCollection: {
                data: {
                    id: model.primaryCollection.id,
                    type: 'collections',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/collections/${model.primaryCollection.id}/`,
                    },
                },
            },
            moderators: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/collections/${model.id}/moderators/`,
                        meta: this.buildRelatedLinkMeta(model, 'moderators'),
                    },
                },
            },
            subscriptions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/collections/${model.id}/subscriptions/`,
                    },
                },
            },
        };
    }
}
