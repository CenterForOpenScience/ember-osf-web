import OsfAdapter from './osf-adapter';

export default class CollectionProvider extends OsfAdapter {
    pathForType(_: string): string {
        return 'providers/collections';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'collection-provider': CollectionProvider;
    } // eslint-disable-line semi
}
