import AddonServiceSerializer from './addon-service-serializer';

export default class AuthorizedStorageAccountSerializer extends AddonServiceSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'authorized-storage-account': AuthorizedStorageAccountSerializer;
    } // eslint-disable-line semi
}
