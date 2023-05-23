import ShareSerializer from './share-serializer';

export default class IndexPropertySearchSerializer extends ShareSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'index-property-search': IndexPropertySearchSerializer;
    } // eslint-disable-line semi
}
