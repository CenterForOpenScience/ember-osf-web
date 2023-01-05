import ActionAdapter from './action';

export default class ReviewActionAdapter extends ActionAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'review-action': ReviewActionAdapter;
    } // eslint-disable-line semi
}
