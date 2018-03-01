import DS from 'ember-data'; // eslint-disable-line no-unused-vars
import OsfAdapter from './osf-adapter';
import FileCacheBypassMixin from 'ember-osf-web/mixins/file-cache-bypass';

export default class File extends OsfAdapter.extend(FileCacheBypassMixin, {
    buildURL(modelName: string, id: string, snapshot: DS.Snapshot, requestType: string): string {
        const url: string = this._super(...arguments);
        if (requestType === 'deleteRecord') {
            // Water Bulter API does not like trailing slashes.
            return url.replace(/\/$/, '');
        }
        return url;
    },
}) {
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data' {
    interface AdapterRegistry {
        'file': File;
    }
}
