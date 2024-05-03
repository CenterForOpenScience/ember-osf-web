import OsfSerializer from './osf-serializer';

export default class ConfiguredCitationAddonSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-citation-addon': ConfiguredCitationAddonSerializer;
    } // eslint-disable-line semi
}
