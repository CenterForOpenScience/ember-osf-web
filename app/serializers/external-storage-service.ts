import OsfSerializer from './osf-serializer';

export default class ExternalStorageServiceSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-storage-service': ExternalStorageServiceSerializer;
    } // eslint-disable-line semi
}
