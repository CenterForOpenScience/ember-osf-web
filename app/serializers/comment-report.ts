import OsfSerializer from './osf-serializer';

export default class CommentReportSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'comment-report': CommentReportSerializer;
    } // eslint-disable-line semi
}
