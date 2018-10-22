import OsfSerializer from './osf-serializer';

export default class PreprintProvider extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'preprint-provider': PreprintProvider;
    } // eslint-disable-line semi
}
