import OsfAdapter from './osf-adapter';

export default class BannerAdapter extends OsfAdapter {
    namespace = '_';
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'banner': BannerAdapter;
    }
}
