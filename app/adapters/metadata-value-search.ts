import ShareAdapter from './share-adapter';

export default class MetadataValueSearchAdapter extends ShareAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'metadata-value-search': MetadataValueSearchAdapter;
    } // eslint-disable-line semi
}
