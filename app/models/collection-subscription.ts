import { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import CollectionProviderModel from 'ember-osf-web/models/collection-provider';
import SubscriptionModel from './subscription';

// subscription model for collection-provider specific notifications to avoid ID conflicts with other provider types
// e.g. preprint_providers, registration_providers with the same ID
export default class CollectionSubscriptionModel extends SubscriptionModel {
    @belongsTo('provider', { inverse: 'subscriptions' })
    provider!: AsyncBelongsTo<CollectionProviderModel> | CollectionProviderModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'collection-subscription': SubscriptionModel;
    } // eslint-disable-line semi
}
