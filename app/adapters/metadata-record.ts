import OsfAdapter from './osf-adapter';

export default class MetadataRecordAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'metadata-record': MetadataRecordAdapter;
    } // eslint-disable-line semi
}
