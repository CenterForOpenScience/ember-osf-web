import OsfAdapter from './osf-adapter';

export default class CollectionSubscriptionAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'collection-subscription': CollectionSubscriptionAdapter;
    } // eslint-disable-line semi
}
