import ConfiguredAddonSerializer from './configured-addon';

export default class ConfiguredCitationAddonSerializer extends ConfiguredAddonSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-citation-addon': ConfiguredCitationAddonSerializer;
    } // eslint-disable-line semi
}
