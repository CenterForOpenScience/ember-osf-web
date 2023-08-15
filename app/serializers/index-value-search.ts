import ShareSerializer from './share-serializer';

export default class IndexValueSearchSerializer extends ShareSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'index-value-search': IndexValueSearchSerializer;
    } // eslint-disable-line semi
}
