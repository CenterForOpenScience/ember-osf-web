import ActionSerializer from './action';

export default class ReviewActionSerializer extends ActionSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'review-action': ReviewActionSerializer;
    } // eslint-disable-line semi
}
