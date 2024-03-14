import JSONAPISerializer from '@ember-data/serializer/json-api';
import { underscore } from '@ember/string';

export default class ExternalCitationServiceSerializer extends JSONAPISerializer {
    keyForAttribute(key: string) {
        return underscore(key);
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-citation-service': ExternalCitationServiceSerializer;
    } // eslint-disable-line semi
}
