import { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import SubscriptionModel from './subscription';

// subscription model for registration-provider specific notifications to avoid ID conflicts with other provider types
// e.g. preprint_providers, collection_providers with the same ID
export default class RegistrationSubscriptionModel extends SubscriptionModel {
    @belongsTo('registration-provider', { inverse: 'subscriptions' })
    provider!: AsyncBelongsTo<RegistrationProviderModel> & RegistrationProviderModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'registration-subscription': SubscriptionModel;
    } // eslint-disable-line semi
}
