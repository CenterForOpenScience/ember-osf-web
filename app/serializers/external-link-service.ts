import GravyValetSerializer from './gravy-valet-serializer';

export default class ExternalLinkServiceSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-link-service': ExternalLinkServiceSerializer;
    } // eslint-disable-line semi
}
