import OsfSerializer from './osf-serializer';

export default class CustomItemMetadataRecordSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'custom-item-metadata-record': CustomItemMetadataRecordSerializer;
    } // eslint-disable-line semi
}
