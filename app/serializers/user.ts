import OsfSerializer from './osf-serializer';

export default class UserSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        user: UserSerializer;
    } // eslint-disable-line semi
}
