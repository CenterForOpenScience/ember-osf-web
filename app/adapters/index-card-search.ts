import ShareAdapter from './share-adapter';
export default class IndexCardSearchAdapter extends ShareAdapter {
    pathForType() {
        return 'index-card-search';
    }

    urlForQueryRecord(queryParams: any, modelName: any) {
        if (!queryParams.page) {
            return super.urlForQueryRecord(queryParams, modelName);
        } else {
            return queryParams.page;
        }
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'index-card-search': IndexCardSearchAdapter;
    } // eslint-disable-line semi
}
