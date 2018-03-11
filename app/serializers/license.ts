import OsfSerializer from './osf-serializer';

export default class License extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'license': License;
    }
}
