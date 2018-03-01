import OsfSerializer from './osf-serializer';

export default class License extends OsfSerializer {}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data' {
    interface SerializerRegistry {
        'license': License;
    }
}
