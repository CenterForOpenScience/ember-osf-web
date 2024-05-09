import GravyValetSerializer from './gravy-valet-serializer';

export default class UserReferenceSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'user-reference': UserReferenceSerializer;
    } // eslint-disable-line semi
}
