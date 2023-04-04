import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class SearchMatchAdapter extends JSONAPIAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'search-match': SearchMatchAdapter;
    } // eslint-disable-line semi
}
