import ShareAdapter from './share-adapter';

export default class MetadataRecordAdapter extends ShareAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'metadata-record': MetadataRecordAdapter;
    } // eslint-disable-line semi
}
