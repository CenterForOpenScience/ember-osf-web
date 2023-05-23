import ShareAdapter from './share-adapter';
export default class IndexCardSearchAdapter extends ShareAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'index-card-search': IndexCardSearchAdapter;
    } // eslint-disable-line semi
}
