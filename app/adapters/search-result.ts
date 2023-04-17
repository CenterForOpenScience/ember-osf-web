import ShareAdapter from './share-adapter';

export default class SearchResultAdapter extends ShareAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'search-result': SearchResultAdapter;
    } // eslint-disable-line semi
}
