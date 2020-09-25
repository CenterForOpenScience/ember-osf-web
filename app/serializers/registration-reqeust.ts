import OsfSerializer from './osf-serializer';

export default class RegistrationRequestSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'registration-request': RegistrationRequestSerializer;
    } // eslint-disable-line semi
}
