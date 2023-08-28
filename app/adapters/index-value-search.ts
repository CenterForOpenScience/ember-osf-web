import ShareAdapter from './share-adapter';

export default class IndexValueSearchAdapter extends ShareAdapter {
    pathForType() {
        return 'index-value-search';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'index-value-search': IndexValueSearchAdapter;
    } // eslint-disable-line semi
}
