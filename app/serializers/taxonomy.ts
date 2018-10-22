import OsfSerializer from './osf-serializer';

export default class Taxonomy extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        taxonomy: Taxonomy;
    } // eslint-disable-line semi
}
