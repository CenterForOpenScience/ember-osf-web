import OsfAdapter from './osf-adapter';

export default class RegistrationSubscriptionAdapter extends OsfAdapter {
    urlForQuery(query: any) {
        return `${this.urlPrefix()}/providers/registrations/${query.providerId}/subscriptions/`;
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'registration-subscription': RegistrationSubscriptionAdapter;
    } // eslint-disable-line semi
}
