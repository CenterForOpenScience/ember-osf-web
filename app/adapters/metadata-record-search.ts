import OsfAdapter from './osf-adapter';

// May need custom adapter superclass for share-search
export default class MetadataRecordSearchAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'metadata-record-search': MetadataRecordSearchAdapter;
    } // eslint-disable-line semi
}
