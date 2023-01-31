import OsfAdapter from './osf-adapter';

export default class CustomFileMetadataRecordAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'custom-file-metadata-record': CustomFileMetadataRecordAdapter;
    } // eslint-disable-line semi
}
