import OsfSerializer from './osf-serializer';

export default class RegistrationSchema extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'registration-schema': RegistrationSchema;
    }
}
