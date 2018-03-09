import OsfAdapter from './osf-adapter';

export default class CommentReport extends OsfAdapter {
}


declare module 'ember-data' {
    interface AdapterRegistry {
        'comment-report': CommentReport;
    }
}
