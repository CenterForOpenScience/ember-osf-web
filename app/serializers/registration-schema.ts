import OsfSerializer from './osf-serializer';

export default class RegistrationSchemaSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'registration-schema': RegistrationSchemaSerializer;
    } // eslint-disable-line semi
}
