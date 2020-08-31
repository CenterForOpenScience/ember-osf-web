import OsfAdapter from './osf-adapter';

export default class SubscriptionAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        subscription: SubscriptionAdapter;
    } // eslint-disable-line semi
}
