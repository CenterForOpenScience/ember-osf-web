import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ConfiguredComputingAddonSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-computing-addon': ConfiguredComputingAddonSerializer;
    } // eslint-disable-line semi
}
