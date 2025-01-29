import GravyValetSerializer from './gravy-valet-serializer';

export default class ExternalComputingServiceSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-computing-service': ExternalComputingServiceSerializer;
    } // eslint-disable-line semi
}
