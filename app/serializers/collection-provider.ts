import OsfSerializer from './osf-serializer';

export default class CollectionProvider extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'collection-provider': CollectionProvider;
    } // eslint-disable-line semi
}
