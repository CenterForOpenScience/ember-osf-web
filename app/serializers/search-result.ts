import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class SearchResultSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'search-result': SearchResultSerializer;
    } // eslint-disable-line semi
}
