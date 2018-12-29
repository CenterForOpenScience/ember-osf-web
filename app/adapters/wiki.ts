import OsfAdapter from './osf-adapter';

export default class WikiAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        wiki: WikiAdapter;
    } // eslint-disable-line semi
}
