import OsfSerializer from './osf-serializer';

export default class RegistrationSchema extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'registration-schema': RegistrationSchema;
    } // eslint-disable-line semi
}
