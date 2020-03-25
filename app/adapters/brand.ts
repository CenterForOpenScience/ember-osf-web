import OsfAdapter from './osf-adapter';

export default class BrandAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        brand: BrandAdapter;
    } // eslint-disable-line semi
}
