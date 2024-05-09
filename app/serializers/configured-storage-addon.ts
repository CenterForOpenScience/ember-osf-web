import GravyValetSerializer from './gravy-valet-serializer';

export default class ConfiguredStorageAddonSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-storage-addon': ConfiguredStorageAddonSerializer;
    } // eslint-disable-line semi
}
