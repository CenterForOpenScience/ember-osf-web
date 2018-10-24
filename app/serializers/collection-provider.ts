import OsfSerializer from './osf-serializer';

export default class CollectionProvider extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'collection-provider': CollectionProvider;
    }
}
