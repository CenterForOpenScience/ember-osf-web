import OsfAdapter from './osf-adapter';

export default class CommentAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        comment: CommentAdapter;
    } // eslint-disable-line semi
}
