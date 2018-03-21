import { getWithDefault } from '@ember/object';
import { merge } from '@ember/polyfills';
import { underscore } from '@ember/string';
import DS from 'ember-data';
import config from 'ember-get-config';
import { pluralize } from 'ember-inflector';
import GenericDataAdapterMixin from 'ember-osf-web/mixins/generic-data-adapter';

const { JSONAPIAdapter, Snapshot } = DS;

/**
 * @module ember-osf-web
 * @submodule adapters
 */
/**
 * Base adapter class for all OSF APIv2 endpoints
 *
 * @class OsfAdapter
 * @extends DS.JSONAPIAdapter
 * @uses GenericDataAdapterMixin
 */
export default class OsfAdapter extends JSONAPIAdapter.extend(GenericDataAdapterMixin, {
    headers: {
        ACCEPT: 'application/vnd.api+json; version=2.4',
    },
    authorizer: config['ember-simple-auth'].authorizer,
    host: config.OSF.apiUrl,
    namespace: config.OSF.apiNamespace,

    /**
     * Overrides buildQuery method - Allows users to embed resources with findRecord
     * OSF APIv2 does not have "include" functionality, instead we use 'embed'.
     * Usage: findRecord(type, id, {include: 'resource'}) or findRecord(type, id, {include: ['resource1', resource2]})
     * Swaps included resources with embedded resources
     *
     * @method buildQuery
     */
    buildQuery(this: OsfAdapter, snapshot: Snapshot): object {
        const query: { include?: any, embed?: any } = this._super(...arguments);
        if (query.include) {
            query.embed = query.include;
        }
        delete query.include;
        return merge(query, getWithDefault(snapshot, 'adapterOptions.query', {}));
    },

    buildURL(
        this: OsfAdapter,
        modelName: string,
        id: string,
        snapshot: Snapshot,
        requestType: string,
    ): string {
        let url: string = this._super(...arguments);
        const options: { url?: string, query?: object } = (snapshot ? snapshot.adapterOptions : false) || {};

        if (requestType === 'deleteRecord') {
            if (snapshot.record.get('links.delete')) {
                url = snapshot.record.get('links.delete');
            } else if (snapshot.record.get('links.self')) {
                url = snapshot.record.get('links.self');
            }
        } else if (requestType === 'updateRecord' || requestType === 'findRecord') {
            if (snapshot.record.get('links.self')) {
                url = snapshot.record.get('links.self');
            }
        } else if (options.url) {
            ({ url } = options);
        }

        // Fix issue where CORS request failed on 301s: Ember does not seem to append trailing
        // slash to URLs for single documents, but DRF redirects to force a trailing slash
        if (url.lastIndexOf('/') !== url.length - 1) {
            url += '/';
        }
        return url;
    },

    ajaxOptions(this: OsfAdapter, _: any, __: any, options?: { isBulk?: boolean }): any {
        const ret = this._super(...arguments);
        if (options && options.isBulk) {
            ret.contentType = 'application/vnd.api+json; ext=bulk';
        }
        return ret;
    },

    pathForType(modelName: string): string {
        const underscored: string = underscore(modelName);
        return pluralize(underscored);
    },

}) {
    authorizer: any;
    host: string;
    namespace: string;
}

declare module 'ember-data' {
  interface AdapterRegistry {
      'osf-adapter': OsfAdapter;
  }
}
