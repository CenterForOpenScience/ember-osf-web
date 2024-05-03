import OsfSerializer from './osf-serializer';

export default class ConfiguredComputingAddonSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-computing-addon': ConfiguredComputingAddonSerializer;
    } // eslint-disable-line semi
}
