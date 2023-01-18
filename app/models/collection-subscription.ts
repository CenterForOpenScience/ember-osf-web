import SubscriptionModel from './subscription';

// subscription model for collection-provider specific notifications to avoid ID conflicts with other provider types
// e.g. preprint_providers, registration_providers with the same ID
export default class CollectionSubscriptionModel extends SubscriptionModel {
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'collection-subscription': SubscriptionModel;
    } // eslint-disable-line semi
}
