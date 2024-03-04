import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ConfiguredCloudComputingAddonSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-cloud-computing-addon': ConfiguredCloudComputingAddonSerializer;
    } // eslint-disable-line semi
}
