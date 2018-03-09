import OsfAdapter from './osf-adapter';

export default class Comment extends OsfAdapter {
}


declare module 'ember-data' {
    interface AdapterRegistry {
        'comment': Comment;
    }
}
