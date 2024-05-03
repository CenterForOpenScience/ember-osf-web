import OsfSerializer from './osf-serializer';
export default class ConfiguredStorageAddonSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-storage-addon': ConfiguredStorageAddonSerializer;
    } // eslint-disable-line semi
}
