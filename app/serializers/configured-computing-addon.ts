import ConfiguredAddonSerializer from './configured-addon';

export default class ConfiguredComputingAddonSerializer extends ConfiguredAddonSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-computing-addon': ConfiguredComputingAddonSerializer;
    } // eslint-disable-line semi
}
