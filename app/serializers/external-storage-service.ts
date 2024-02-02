import AddonServiceSerializer from './addon-service-serializer';

export default class ExternalStorageServiceSerializer extends AddonServiceSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-storage-service': ExternalStorageServiceSerializer;
    } // eslint-disable-line semi
}
