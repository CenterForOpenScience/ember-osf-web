import ConfiguredAddonSerializer from './configured-addon';

export default class ConfiguredStorageAddonSerializer extends ConfiguredAddonSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-storage-addon': ConfiguredStorageAddonSerializer;
    } // eslint-disable-line semi
}
