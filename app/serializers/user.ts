import OsfSerializer from './osf-serializer';

export default class User extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        user: User;
    } // eslint-disable-line semi
}
