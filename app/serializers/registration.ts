import OsfSerializer from './osf-serializer';

export default class RegistrationSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        registration: RegistrationSerializer;
    } // eslint-disable-line semi
}
