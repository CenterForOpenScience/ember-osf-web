import OsfAdapter from './osf-adapter';

export default class MetadataPropertySearchAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'metadata-property-search': MetadataPropertySearchAdapter;
    } // eslint-disable-line semi
}
