import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class UserReferenceSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'user-reference': UserReferenceSerializer;
    } // eslint-disable-line semi
}
