import GravyValetSerializer from './gravy-valet-serializer';

export default class AuthorizedLinkAccountSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'authorized-link-account': AuthorizedLinkAccountSerializer;
    } // eslint-disable-line semi
}
