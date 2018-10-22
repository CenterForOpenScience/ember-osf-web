import OsfAdapter from './osf-adapter';

export default class RegistryProvider extends OsfAdapter {
    pathForType(_: string): string {
        return 'providers/registries';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'registry-provider': RegistryProvider;
    } // eslint-disable-line semi
}
