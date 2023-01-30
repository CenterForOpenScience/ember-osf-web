import OsfAdapter from './osf-adapter';

export default class CustomItemMetadataRecordAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'custom-item-metadata-record': CustomItemMetadataRecordAdapter;
    } // eslint-disable-line semi
}
