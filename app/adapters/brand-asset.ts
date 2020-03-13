import OsfAdapter from './osf-adapter';

export default class BrandAssetAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'brand-asset': BrandAssetAdapter;
    } // eslint-disable-line semi
}
