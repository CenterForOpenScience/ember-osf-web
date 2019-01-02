import OsfAdapter from './osf-adapter';

export default class RegistryProviderAdapter extends OsfAdapter {
    pathForType(_: string): string {
        return 'providers/registries';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'registry-provider': RegistryProviderAdapter;
    } // eslint-disable-line semi
}
