import ShareSerializer from './share-serializer';

export default class MetadataRecordSearchSerializer extends ShareSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'metadata-record-search': MetadataRecordSearchSerializer;
    } // eslint-disable-line semi
}
