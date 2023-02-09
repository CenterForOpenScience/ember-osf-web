import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import CollectionSubscription from 'ember-osf-web/models/collection-subscription';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class CollectionSubscriptionSerializer extends ApplicationSerializer<CollectionSubscription> {
    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/collection_subscriptions/${model.id}/`,
        };
    }
    buildRelationships(model: ModelInstance<CollectionSubscription>) {
        return {
            provider: {
                data: {
                    id: model.provider.id,
                    type: 'collection-providers',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/providers/collections/${model.provider.id}/`,
                    },
                },
            },
        };
    }
}
