import OsfAdapter from './osf-adapter';

export default class ReviewActionAdapter extends OsfAdapter {
    pathForType(_: string): string {
        return 'actions/reviews/';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'review-action': ReviewActionAdapter;
    } // eslint-disable-line semi
}
