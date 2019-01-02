import OsfSerializer from './osf-serializer';

export default class UserEmailSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'user-email': UserEmailSerializer;
    } // eslint-disable-line semi
}
