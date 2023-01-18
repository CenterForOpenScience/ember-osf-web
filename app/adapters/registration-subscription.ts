import OsfAdapter from './osf-adapter';

export default class RegistrationSubscriptionAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'registration-subscription': RegistrationSubscriptionAdapter;
    } // eslint-disable-line semi
}
