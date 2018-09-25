import OsfAdapter from './osf-adapter';

export default class CollectionProvider extends OsfAdapter {
    pathForType(_: string): string {
        return 'providers/collections';
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'collection-provider': CollectionProvider;
    }
}
