import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class SearchMatchSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'search-match': SearchMatchSerializer;
    } // eslint-disable-line semi
}
