import JSONAPISerializer from '@ember-data/serializer/json-api';
export default class AuthorizedStorageAccountSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'authorized-storage-account': AuthorizedStorageAccountSerializer;
    } // eslint-disable-line semi
}
