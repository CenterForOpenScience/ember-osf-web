import OsfSerializer from './osf-serializer';

export default class IdentifierSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        identifier: IdentifierSerializer;
    } // eslint-disable-line semi
}
