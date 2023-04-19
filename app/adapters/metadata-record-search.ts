import ShareAdapter from './share-adapter';
export default class MetadataRecordSearchAdapter extends ShareAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'metadata-record-search': MetadataRecordSearchAdapter;
    } // eslint-disable-line semi
}
