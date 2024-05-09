import GravyValetSerializer from './gravy-valet-serializer';

export default class ExternalStorageServiceSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-storage-service': ExternalStorageServiceSerializer;
    } // eslint-disable-line semi
}
