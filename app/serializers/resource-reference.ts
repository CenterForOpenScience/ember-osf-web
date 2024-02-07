import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ResourceReferenceSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'resource-reference': ResourceReferenceSerializer;
    } // eslint-disable-line semi
}
