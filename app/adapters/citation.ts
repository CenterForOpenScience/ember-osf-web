import OsfAdapter from './osf-adapter';

export default class CitationAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        citation: CitationAdapter;
    } // eslint-disable-line semi
}
