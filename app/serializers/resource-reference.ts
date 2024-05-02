import JSONAPISerializer from '@ember-data/serializer/json-api';
import { dasherize } from '@ember/string';

export default class ResourceReferenceSerializer extends JSONAPISerializer {
    keyForRelationship(key: string) {
        return dasherize(key);
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'resource-reference': ResourceReferenceSerializer;
    } // eslint-disable-line semi
}
