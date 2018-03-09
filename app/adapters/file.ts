import OsfAdapter from './osf-adapter';
import FileCacheBypassMixin from 'ember-osf-web/mixins/file-cache-bypass';

export default class File extends OsfAdapter.extend(FileCacheBypassMixin).extend({
    buildURL(this: File, modelName: string, id: string, snapshot: DS.Snapshot, requestType: string): string {
        const url: string = this._super(...arguments);
        if (requestType === 'deleteRecord') {
            // Water Bulter API does not like trailing slashes.
            return url.replace(/\/$/, '');
        }
        return url;
    },
}) {}


declare module 'ember-data' {
    interface AdapterRegistry {
        'file': File;
    }
}
