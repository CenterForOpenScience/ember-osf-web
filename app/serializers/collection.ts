import OsfSerializer from './osf-serializer';

export default class CollectionSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        collection: CollectionSerializer;
    } // eslint-disable-line semi
}
