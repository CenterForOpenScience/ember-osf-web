import OsfAdapter from './osf-adapter';

export default class RegistryProvider extends OsfAdapter {
    pathForType(_: string): string {
        return 'providers/registries';
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'registry-provider': RegistryProvider;
    }
}
