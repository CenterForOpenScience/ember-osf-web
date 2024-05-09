import GravyValetSerializer from './gravy-valet-serializer';

export default class ConfiguredComputingAddonSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-computing-addon': ConfiguredComputingAddonSerializer;
    } // eslint-disable-line semi
}
