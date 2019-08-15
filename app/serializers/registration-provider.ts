import OsfSerializer from './osf-serializer';

export default class RegistrationProviderSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'registration-provider': RegistrationProviderSerializer;
    } // eslint-disable-line semi
}
