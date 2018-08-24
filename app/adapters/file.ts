import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

export default class File extends OsfAdapter.extend({
    buildURL(this: File, modelName: string, id: string, snapshot: DS.Snapshot, requestType: string): string {
        const url: string = this._super(modelName, id, snapshot, requestType);

        // Water Bulter API does not like trailing slashes.
        return requestType === 'deleteRecord' ? url.replace(/\/$/, '') : url;
    },

}) {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        file: File;
    }
}
