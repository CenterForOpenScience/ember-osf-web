import OsfAdapter from './osf-adapter';

export default class Comment extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        comment: Comment;
    } // eslint-disable-line semi
}
