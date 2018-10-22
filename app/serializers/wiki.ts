import OsfSerializer from './osf-serializer';

export default class Wiki extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        wiki: Wiki;
    } // eslint-disable-line semi
}
