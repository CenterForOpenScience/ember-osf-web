import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class MetadataPropertySearchAdapter extends JSONAPIAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'metadata-property-search': MetadataPropertySearchAdapter;
    } // eslint-disable-line semi
}
