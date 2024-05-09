import GravyValetSerializer from './gravy-valet-serializer';

export default class AuthorizedComputingAccountSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'authorized-computing-account': AuthorizedComputingAccountSerializer;
    } // eslint-disable-line semi
}
