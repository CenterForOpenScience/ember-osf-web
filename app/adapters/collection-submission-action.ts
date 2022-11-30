import ActionAdapter from './action';

export default class CollectionSubmissionActionAdapter extends ActionAdapter {
    urlForCreateRecord() {
        // Eventually remove this when we can just post to /v2/collection_submissions/:id/actions
        return `${this.urlPrefix()}/collection_submission_actions/`;
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'collection-submission-action': CollectionSubmissionActionAdapter;
    } // eslint-disable-line semi
}
