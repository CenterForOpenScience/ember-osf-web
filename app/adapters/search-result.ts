import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class SearchResultAdapter extends JSONAPIAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'search-result': SearchResultAdapter;
    } // eslint-disable-line semi
}
