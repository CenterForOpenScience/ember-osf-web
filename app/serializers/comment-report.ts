import OsfSerializer from './osf-serializer';

export default class CommentReport extends OsfSerializer {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'comment-report': CommentReport;
    } // eslint-disable-line semi
}
