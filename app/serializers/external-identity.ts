import OsfSerializer from './osf-serializer';

export default class ExternalIdentitySerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-identity': ExternalIdentitySerializer;
    } // eslint-disable-line semi
}
