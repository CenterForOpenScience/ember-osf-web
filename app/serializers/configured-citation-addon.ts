import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ConfiguredCitationAddonSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-citation-addon': ConfiguredCitationAddonSerializer;
    } // eslint-disable-line semi
}
