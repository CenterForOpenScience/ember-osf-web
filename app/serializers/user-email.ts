import OsfSerializer from './osf-serializer';

export default class UserEmailSerializer extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'user-email': UserEmailSerializer;
    }
}
