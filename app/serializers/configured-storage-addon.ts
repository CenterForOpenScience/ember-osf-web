import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ConfiguredStorageAddonSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-storage-addon': ConfiguredStorageAddonSerializer;
    } // eslint-disable-line semi
}
