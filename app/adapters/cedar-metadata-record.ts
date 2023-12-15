import OsfAdapter from './osf-adapter';

export default class CedarMetadataRecordAdapter extends OsfAdapter { }

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'cedar-metadata-record': CedarMetadataRecordAdapter;
    } // eslint-disable-line semi
}
