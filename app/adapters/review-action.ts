import OsfAdapter from './osf-adapter';

export default class ReviewActionAdapter extends OsfAdapter {
    parentRelationship = 'target';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'review-action': ReviewActionAdapter;
    } // eslint-disable-line semi
}
