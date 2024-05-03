import OsfSerializer from './osf-serializer';

export default class UserReferenceSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'user-reference': UserReferenceSerializer;
    } // eslint-disable-line semi
}
