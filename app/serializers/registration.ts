import OsfSerializer from './osf-serializer';

export default class Registration extends OsfSerializer {}


declare module 'ember-data' {
    interface SerializerRegistry {
        'registration': Registration;
    }
}
