import ShareSerializer from './share-serializer';

export default class IndexCardSearchSerializer extends ShareSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'index-card-search': IndexCardSearchSerializer;
    } // eslint-disable-line semi
}
