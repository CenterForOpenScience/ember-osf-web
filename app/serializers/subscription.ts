import OsfSerializer from './osf-serializer';

export default class SubscriptionSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        subscription: SubscriptionSerializer;
    } // eslint-disable-line semi
}
