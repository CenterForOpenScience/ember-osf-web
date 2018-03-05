import OsfAdapter from './osf-adapter';

export default class ReviewAction extends OsfAdapter {
    pathForType = function(): string {
        return 'actions/reviews/';
    };
}


declare module 'ember-data' {
    interface AdapterRegistry {
        'review-action': ReviewAction;
    }
}
