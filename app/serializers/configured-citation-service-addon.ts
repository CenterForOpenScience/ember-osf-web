import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ConfiguredCitationServiceAddonSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-citation-service-addon': ConfiguredCitationServiceAddonSerializer;
    } // eslint-disable-line semi
}
