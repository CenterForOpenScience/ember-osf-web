import ShareSerializer from './share-serializer';

export default class MetadataValueSearchSerializer extends ShareSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'metadata-value-search': MetadataValueSearchSerializer;
    } // eslint-disable-line semi
}
