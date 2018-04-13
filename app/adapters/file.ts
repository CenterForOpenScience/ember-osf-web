import { service } from '@ember-decorators/service';
import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

export default class File extends OsfAdapter.extend({
    buildURL(this: File, modelName: string, id: string, snapshot: DS.Snapshot, requestType: string): string {
        const url: string = this._super(modelName, id, snapshot, requestType);

        // Water Bulter API does not like trailing slashes.
        return requestType === 'deleteRecord' ? url.replace(/\/$/, '') : url;
    },

    /**
     * This is a hack to resolve a server-side race condition.
     * After creating/modifying/deleting a file through Waterbutler, it can take
     * a fraction of a second for the API's cache to properly update, and
     * trying to reload the file model in that time can return stale data.
     *
     * This adapter mixin appends a nonce to requests that are likely to run into
     * that race condition, forcing a cache miss.
     */
    ajaxOptions(this: File, ...args) {
        const options = this._super(...args);

        if (this.get('fileManager').isReloadingUrl(options.url)) {
            const prefix = options.url.includes('?') ? '&' : '?';
            const nonce = Date.now();
            // The name of the query parameter doesn't matter, just the nonce
            options.url += `${prefix}cachebypass=${nonce}`;
        }

        return options;
    },
}) {
    @service fileManager;
}

declare module 'ember-data' {
    interface AdapterRegistry {
        file: File;
    }
}
