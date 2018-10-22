import OsfSerializer from './osf-serializer';

export default class Citation extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        citation: Citation;
    } // eslint-disable-line semi
}
