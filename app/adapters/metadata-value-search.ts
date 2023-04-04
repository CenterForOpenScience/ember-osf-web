import OsfAdapter from './osf-adapter';

export default class MetadataValueSearchAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'metadata-value-search': MetadataValueSearchAdapter;
    } // eslint-disable-line semi
}
