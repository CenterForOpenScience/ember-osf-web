import AddonServiceSerializer from './addon-service-serializer';

export default class ConfiguredStorageAddonSerializer extends AddonServiceSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-storage-addon': ConfiguredStorageAddonSerializer;
    } // eslint-disable-line semi
}
