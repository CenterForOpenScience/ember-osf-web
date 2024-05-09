import GravyValetSerializer from './gravy-valet-serializer';

export default class AuthorizedCitationAccountSerializer extends GravyValetSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'authorized-citation-account': AuthorizedCitationAccountSerializer;
    } // eslint-disable-line semi
}
