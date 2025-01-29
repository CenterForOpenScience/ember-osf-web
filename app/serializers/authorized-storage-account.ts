import GravyValetSerializer from './gravy-valet-serializer';

export default class AuthorizedStorageAccountSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'authorized-storage-account': AuthorizedStorageAccountSerializer;
    } // eslint-disable-line semi
}
