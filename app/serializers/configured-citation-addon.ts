import GravyValetSerializer from './gravy-valet-serializer';

export default class ConfiguredCitationAddonSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-citation-addon': ConfiguredCitationAddonSerializer;
    } // eslint-disable-line semi
}
