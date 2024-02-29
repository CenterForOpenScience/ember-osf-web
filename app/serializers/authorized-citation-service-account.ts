import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class AuthorizedCitationServiceAccountSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'authorized-citation-service-account': AuthorizedCitationServiceAccountSerializer;
    } // eslint-disable-line semi
}
