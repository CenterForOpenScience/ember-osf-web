import OsfSerializer from './osf-serializer';

export default class RegistrationMetaschema extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'registration-metaschema': RegistrationMetaschema;
    }
}
