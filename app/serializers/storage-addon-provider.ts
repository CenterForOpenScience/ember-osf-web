import OsfSerializer from './osf-serializer';

export default class StorageAddonProviderSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'storage-addon-provider': StorageAddonProviderSerializer;
    } // eslint-disable-line semi
}
