import ShareSerializer from './share-serializer';

export default class IndexCardSerializer extends ShareSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'index-card': IndexCardSerializer;
    } // eslint-disable-line semi
}
