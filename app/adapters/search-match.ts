import OsfAdapter from './osf-adapter';

export default class SearchMatchAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'search-match': SearchMatchAdapter;
    } // eslint-disable-line semi
}
