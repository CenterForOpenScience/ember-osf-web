import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class CitationServiceSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'citation-service': CitationServiceSerializer;
    } // eslint-disable-line semi
}
