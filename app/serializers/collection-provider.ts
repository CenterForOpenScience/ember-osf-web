import OsfSerializer from './osf-serializer';

export default class CollectionProviderSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'collection-provider': CollectionProviderSerializer;
    } // eslint-disable-line semi
}
