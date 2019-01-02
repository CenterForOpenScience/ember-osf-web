import DS from 'ember-data';

import OsfAdapter from './osf-adapter';

export default class FileAdapter extends OsfAdapter {
    buildURL(modelName: string, id: string, snapshot: DS.Snapshot, requestType: string): string {
        const url = super.buildURL(modelName, id, snapshot, requestType);

        // Water Bulter API does not like trailing slashes.
        return requestType === 'deleteRecord' ? url.replace(/\/$/, '') : url;
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        file: FileAdapter;
    } // eslint-disable-line semi
}
