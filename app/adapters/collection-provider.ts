import OsfAdapter from './osf-adapter';

export default class CollectionProviderAdapter extends OsfAdapter {
    pathForType(_: string): string {
        return 'providers/collections';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'collection-provider': CollectionProviderAdapter;
    } // eslint-disable-line semi
}
