import ShareSerializer from './share-serializer';

export default class MetadataRecordSerializer extends ShareSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'metadata-record': MetadataRecordSerializer;
    } // eslint-disable-line semi
}
