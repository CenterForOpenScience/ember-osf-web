import OsfSerializer from './osf-serializer';

export default class License extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        license: License;
    } // eslint-disable-line semi
}
