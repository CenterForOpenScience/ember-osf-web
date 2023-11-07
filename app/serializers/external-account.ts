import OsfSerializer from './osf-serializer';

export default class ExternalAccountSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'external-account': ExternalAccountSerializer;
    } // eslint-disable-line semi
}
