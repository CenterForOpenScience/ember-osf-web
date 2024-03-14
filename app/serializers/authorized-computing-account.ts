import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class AuthorizedComputingAccountSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'authorized-computing-account': AuthorizedComputingAccountSerializer;
    } // eslint-disable-line semi
}
