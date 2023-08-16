import ShareSerializer from './share-serializer';

export default class RelatedPropertyPathSerializer extends ShareSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'related-property-path': RelatedPropertyPathSerializer;
    } // eslint-disable-line semi
}
