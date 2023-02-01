import OsfAdapter from './osf-adapter';

export default class CollectionSubscriptionAdapter extends OsfAdapter {
    parentRelationship = 'collection-provider';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'collection-subscription': CollectionSubscriptionAdapter;
    } // eslint-disable-line semi
}
