import JSONAPIAdapter from '@ember-data/adapter/json-api';
// May need custom adapter superclass for share-search
export default class MetadataRecordSearchAdapter extends JSONAPIAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'metadata-record-search': MetadataRecordSearchAdapter;
    } // eslint-disable-line semi
}
