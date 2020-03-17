import OsfAdapter from './osf-adapter';

export default class RegistrationProviderAdapter extends OsfAdapter {
    pathForType(_: string): string {
        return 'providers/registrations';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'registration-provider': RegistrationProviderAdapter;
    } // eslint-disable-line semi
}
