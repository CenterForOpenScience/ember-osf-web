import OsfSerializer from './osf-serializer';

export default class AuthorizedCitationAccountSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'authorized-citation-account': AuthorizedCitationAccountSerializer;
    } // eslint-disable-line semi
}
