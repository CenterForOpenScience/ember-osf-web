import ShareAdapter from './share-adapter';

export default class RelatedPropertyPathAdapter extends ShareAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'related-property-path': RelatedPropertyPathAdapter;
    } // eslint-disable-line semi
}
