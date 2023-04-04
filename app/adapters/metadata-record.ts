import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class MetadataRecordAdapter extends JSONAPIAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'metadata-record': MetadataRecordAdapter;
    } // eslint-disable-line semi
}
