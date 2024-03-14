import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class AuthorizedCitationAccountSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'authorized-citation-account': AuthorizedCitationAccountSerializer;
    } // eslint-disable-line semi
}
