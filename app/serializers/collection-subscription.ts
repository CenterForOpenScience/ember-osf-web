import OsfSerializer from './osf-serializer';

export default class CollectionSubscriptionSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'collection-subscription': CollectionSubscriptionSerializer;
    } // eslint-disable-line semi
}
