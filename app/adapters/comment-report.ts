import OsfAdapter from './osf-adapter';

export default class CommentReportAdapter extends OsfAdapter {
    parentRelationship = 'comment';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'comment-report': CommentReportAdapter;
    } // eslint-disable-line semi
}
