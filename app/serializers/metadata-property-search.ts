import ShareSerializer from './share-serializer';

export default class MetadataPropertySearchSerializer extends ShareSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'metadata-property-search': MetadataPropertySearchSerializer;
    } // eslint-disable-line semi
}
