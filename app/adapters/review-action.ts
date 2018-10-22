import OsfAdapter from './osf-adapter';

export default class ReviewAction extends OsfAdapter {
    pathForType(_: string): string {
        return 'actions/reviews/';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'review-action': ReviewAction;
    } // eslint-disable-line semi
}
