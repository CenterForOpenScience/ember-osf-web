import AddonServiceSerializer from './addon-service-serializer';

export default class InternalResourceSerializer extends AddonServiceSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'internal-resource': InternalResourceSerializer;
    } // eslint-disable-line semi
}
