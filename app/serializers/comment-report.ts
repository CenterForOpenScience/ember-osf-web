import OsfSerializer from './osf-serializer';

export default class CommentReport extends OsfSerializer {}


declare module 'ember-data' {
    interface SerializerRegistry {
        'comment-report': CommentReport;
    }
}
