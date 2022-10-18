import ActionAdapter from './action';

export default class CollectionSubmissionActionAdapter extends ActionAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'collection-submission-action': CollectionSubmissionActionAdapter;
    } // eslint-disable-line semi
}
