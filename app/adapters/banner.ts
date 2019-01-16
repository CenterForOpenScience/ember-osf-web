import OsfAdapter from './osf-adapter';

export default class BannerAdapter extends OsfAdapter {
    namespace = '_';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        banner: BannerAdapter;
    } // eslint-disable-line semi
}
