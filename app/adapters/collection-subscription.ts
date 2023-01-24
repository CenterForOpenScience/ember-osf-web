import OsfAdapter from './osf-adapter';

export default class CollectionSubscriptionAdapter extends OsfAdapter {
    urlForQuery(query: any) {
        return `${this.urlPrefix()}/providers/collections/${query.providerId}/subscriptions/`;
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'collection-subscription': CollectionSubscriptionAdapter;
    } // eslint-disable-line semi
}
