import OsfAdapter from './osf-adapter';

export default class TaxonomyAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        taxonomy: TaxonomyAdapter;
    } // eslint-disable-line semi
}
