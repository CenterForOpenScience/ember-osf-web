import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class AuthorizedCloudComputingAccountSerializer extends JSONAPISerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'authorized-cloud-computing-account': AuthorizedCloudComputingAccountSerializer;
    } // eslint-disable-line semi
}
