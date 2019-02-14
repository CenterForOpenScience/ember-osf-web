import OsfSerializer from './osf-serializer';

export default class UserPasswordSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'user-password': UserPasswordSerializer;
    } // eslint-disable-line semi
}
