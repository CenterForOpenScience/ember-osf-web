import OsfAdapter from './osf-adapter';

export default class CommentReport extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'comment-report': CommentReport;
    } // eslint-disable-line semi
}
