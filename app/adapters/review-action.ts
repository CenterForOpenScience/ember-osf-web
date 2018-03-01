import OsfAdapter from './osf-adapter';

export default class ReviewAction extends OsfAdapter {
    pathForType = function(): string {
        return 'actions/reviews/';
    };
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data' {
    interface AdapterRegistry {
        'review-action': ReviewAction;
    }
}
