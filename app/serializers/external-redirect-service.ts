import GravyValetSerializer from './gravy-valet-serializer';

export default class ExternalRedirectServiceSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-redirect-service': ExternalRedirectServiceSerializer;
    } // eslint-disable-line semi
}
