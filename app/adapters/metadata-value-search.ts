import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class MetadataValueSearchAdapter extends JSONAPIAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'metadata-value-search': MetadataValueSearchAdapter;
    } // eslint-disable-line semi
}
