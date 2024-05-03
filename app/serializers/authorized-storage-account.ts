import OsfSerializer from './osf-serializer';

export default class AuthorizedStorageAccountSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'authorized-storage-account': AuthorizedStorageAccountSerializer;
    } // eslint-disable-line semi
}
