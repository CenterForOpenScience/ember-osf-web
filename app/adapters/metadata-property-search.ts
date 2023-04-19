import ShareAdapter from './share-adapter';

export default class MetadataPropertySearchAdapter extends ShareAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'metadata-property-search': MetadataPropertySearchAdapter;
    } // eslint-disable-line semi
}
