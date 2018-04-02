import OsfSerializer from './osf-serializer';

export default class User extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'user': User;
    }
}
