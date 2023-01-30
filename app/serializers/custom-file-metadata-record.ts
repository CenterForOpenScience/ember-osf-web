import OsfSerializer from './osf-serializer';

export default class CustomFileMetadataRecordSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'custom-file-metadata-record': CustomFileMetadataRecordSerializer;
    } // eslint-disable-line semi
}
