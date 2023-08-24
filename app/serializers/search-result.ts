import ShareSerializer from './share-serializer';

export default class SearchResultSerializer extends ShareSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'search-result': SearchResultSerializer;
    } // eslint-disable-line semi
}
