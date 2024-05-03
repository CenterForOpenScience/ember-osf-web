import OsfSerializer from './osf-serializer';

export default class AuthorizedComputingAccountSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'authorized-computing-account': AuthorizedComputingAccountSerializer;
    } // eslint-disable-line semi
}
