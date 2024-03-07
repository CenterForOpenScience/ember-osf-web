import JSONAPISerializer from '@ember-data/serializer/json-api';
import { underscore } from '@ember/string';

export default class CitationServiceSerializer extends JSONAPISerializer {
    keyForAttribute(key: string) {
        return underscore(key);
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'citation-service': CitationServiceSerializer;
    } // eslint-disable-line semi
}
