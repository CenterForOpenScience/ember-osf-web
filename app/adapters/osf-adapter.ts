import { service } from '@ember-decorators/service';
import { assert } from '@ember/debug';
import { underscore } from '@ember/string';
import DS from 'ember-data';
import config from 'ember-get-config';
import { pluralize } from 'ember-inflector';

import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const { JSONAPIAdapter, Snapshot } = DS;

interface AdapterOptions {
    query?: string;
}

enum RequestType {
    DELETE = 'DELETE',
    GET = 'GET',
    PATCH = 'PATCH',
    POST = 'POST',
    PUT = 'PUT',
}

/**
 * @module ember-osf-web
 * @submodule adapters
 */
/**
 * Base adapter class for all OSF APIv2 endpoints
 *
 * @class OsfAdapter
 * @extends DS.JSONAPIAdapter
 */
export default class OsfAdapter extends JSONAPIAdapter.extend(DataAdapterMixin) {
    @service currentUser;

    host = config.OSF.apiUrl;
    namespace = config.OSF.apiNamespace;
    headers = {
        ACCEPT: 'application/vnd.api+json; version=2.4',
    };

    /**
     * Overrides buildQuery method - Allows users to embed resources with findRecord
     * OSF APIv2 does not have "include" functionality, instead we use 'embed'.
     * Usage: findRecord(type, id, {include: 'resource'}) or findRecord(type, id, {include: ['resource1', resource2]})
     * Swaps included resources with embedded resources
     *
     * @method buildQuery
     */
    buildQuery(this: OsfAdapter, snapshot: DS.Snapshot): object {
        const { query: adapterOptionsQuery = {} } = (snapshot.adapterOptions || {}) as AdapterOptions;

        const query: { include?: any, embed?: any } = {
            ...super.buildQuery(snapshot),
            ...adapterOptionsQuery,
        };

        return {
            ...query,
            embed: query.include,
            include: undefined,
        };
    }

    buildURL(
        this: OsfAdapter,
        modelName: string | undefined,
        id: string,
        snapshot: DS.Snapshot,
        requestType: string,
    ): string {
        let url: string = super.buildURL(modelName, id, snapshot, requestType);

        // Fix issue where CORS request failed on 301s: Ember does not seem to append trailing
        // slash to URLs for single documents, but DRF redirects to force a trailing slash
        if (url.lastIndexOf('/') !== url.length - 1) {
            url += '/';
        }
        return url;
    }

    authorize(this: OsfAdapter, xhr: XMLHttpRequest) {
        const accessToken = this.get('currentUser').get('accessToken');
        if (accessToken) {
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        } else {
            xhr.withCredentials = true; // eslint-disable-line no-param-reassign
        }
    }

    ajaxOptions(this: OsfAdapter, url: string, type: RequestType, options?: { isBulk?: boolean }): any {
        const hash = super.ajaxOptions(url, type, options) as any;
        if (options && options.isBulk) {
            hash.contentType = 'application/vnd.api+json; ext=bulk';
        }
        return hash;
    }

    pathForType(modelName: string): string {
        const underscored: string = underscore(modelName);
        return pluralize(underscored);
    }

    urlForFindRecord(id: string, modelName: string, snapshot: DS.Snapshot) {
        const url = snapshot.record.get('links.self');
        return url || super.urlForFindRecord(id, modelName, snapshot);
    }

    urlForUpdateRecord(id: string, modelName: string, snapshot: DS.Snapshot) {
        const url = snapshot.record.get('links.self');
        return url || super.urlForUpdateRecord(id, modelName, snapshot);
    }

    urlForDeleteRecord(id: string, modelName: string, snapshot: DS.Snapshot) {
        const links = snapshot.record.get('links');
        return links.delete || links.self || super.urlForDeleteRecord(id, modelName, snapshot);
    }

    urlForFindBelongsTo(id: string, modelName: string): string {
        assert(
            `The API should have given a link for fetching this belongsTo (id: ${id}, type: ${modelName})`,
            false,
        );
        return '';
    }

    urlForFindHasMany(id: string, modelName: string): string {
        assert(
            `The API should have given a link for fetching this hasMany (id: ${id}, type: ${modelName})`,
            false,
        );
        return '';
    }

    urlForFindMany(): string {
        // TODO support coalesceFindRequests?
        assert('Coalescing find requests is not supported', false);
        return '';
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'osf-adapter': OsfAdapter;
    }
}
