import GravyValetSerializer from './gravy-valet-serializer';

export default class ExternalCitationServiceSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-citation-service': ExternalCitationServiceSerializer;
    } // eslint-disable-line semi
}
