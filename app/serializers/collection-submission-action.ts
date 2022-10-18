import ActionSerializer from './action';

export default class CollectionSubmissionActionSerializer extends ActionSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'collection-submission-action': CollectionSubmissionActionSerializer;
    } // eslint-disable-line semi
}
