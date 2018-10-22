import OsfSerializer from './osf-serializer';

export default class Preprint extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        preprint: Preprint;
    } // eslint-disable-line semi
}
