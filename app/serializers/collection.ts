import OsfSerializer from './osf-serializer';

export default class Collection extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        collection: Collection;
    } // eslint-disable-line semi
}
