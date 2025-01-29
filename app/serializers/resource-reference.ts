import GravyValetSerializer from './gravy-valet-serializer';

export default class ResourceReferenceSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'resource-reference': ResourceReferenceSerializer;
    } // eslint-disable-line semi
}
