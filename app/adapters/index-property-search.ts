import ShareAdapter from './share-adapter';

export default class IndexPropertySearchAdapter extends ShareAdapter {
    pathForType() {
        return 'index-property-search';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'index-property-search': IndexPropertySearchAdapter;
    } // eslint-disable-line semi
}
