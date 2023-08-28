import ShareAdapter from './share-adapter';

export default class IndexCardAdapter extends ShareAdapter {
    pathForType() {
        return 'index-card';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'index-card': IndexCardAdapter;
    } // eslint-disable-line semi
}
