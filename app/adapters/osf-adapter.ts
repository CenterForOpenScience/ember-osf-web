import { isArray } from '@ember/array';
import { getWithDefault } from '@ember/object';
import { merge } from '@ember/polyfills';
import { capitalize, underscore } from '@ember/string';
import DS from 'ember-data';
import $ from 'jquery';
import { allSettled, hashSettled } from 'rsvp';

import config from 'ember-get-config';
import GenericDataAdapterMixin from 'ember-osf-web/mixins/generic-data-adapter';

import { pluralize, singularize } from 'ember-inflector';

const { JSONAPIAdapter } = DS;

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
    buildQuery(this: OsfAdapter, snapshot: DS.Snapshot): object {
        const query: { include?: any, embed?: any } = this._super(...arguments);
        if (query.include) {
            query.embed = query.include;
        }
        delete query.include;
        return merge(query, getWithDefault(snapshot, 'adapterOptions.query', {}));
    },
    buildURL(this: OsfAdapter, modelName: string, id: string, snapshot: DS.Snapshot, requestType: string): string {
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
        // Allow a query to be passed along in the adapterOptions.
        if (options && options.query) {
            url += `?${$.param(options.query)}`;
        }
        return url;
    },
    /**
     * Construct a URL for a relationship create/update/delete.
     *
     * @method _buildRelationshipURL
     * @private
     * @param {DS.Snapshot} snapshot
     * @param {String} relationship the relationship to build a url for
     * @return {String} a URL
     */
    _buildRelationshipURL(snapshot: DS.Snapshot, relationship?: string): null | string {
        const links: { self?: { href: string }, related?: { href: string } } = snapshot.record
            .get(`relationshipLinks.${underscore(relationship)}.links`);

        if (!links) {
            return null;
        }

        return links.self ? links.self.href : links.related.href;
    },
    /**
     * Handle creation of related resources
     *
     * @method _createRelated
     * @private
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} createdSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     */
    _createRelated(
        store: DS.Store,
        snapshot: DS.Snapshot,
        createdSnapshots: any[],
        relationship: string,
        url: string,
    ) { // , isBulk = false) {
        // TODO support bulk create?
        // if (isBulk) {
        //
        // }
        return createdSnapshots.map(s => s.record.save({
            adapterOptions: {
                nested: true,
                url,
                requestType: 'create',
            },
        }).then(res => {
            snapshot.record.resolveRelationship(relationship).addCanonicalInternalModel(s.record._internalModel);
            return res;
        }));
    },
    /**
     * Handle add(s) of related resources. This differs from CREATEs in that the related
     * record is already saved and is just being associated with the inverse record.
     *
     * @method _addRelated
     * @private
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} addedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     */
    _addRelated(
        this: OsfAdapter,
        store: DS.Store,
        snapshot: DS.Snapshot,
        addedSnapshots: DS.Snapshot[],
        relationship: string,
        url: string,
        isBulk: boolean = false,
    ): Promise<any> {
        return this._doRelatedRequest(store, snapshot, addedSnapshots, relationship, url, 'POST', isBulk)
            .then(res => {
                addedSnapshots.forEach(s => {
                    snapshot.record
                        .resolveRelationship(relationship)
                        .addCanonicalInternalModel(s.record._internalModel);
                });
                return res;
            });
    },
    /**
     * Handle update(s) of related resources
     *
     * @method _updateRelated
     * @private
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} updatedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     */
    _updateRelated(
        this: OsfAdapter,
        store: DS.Store,
        snapshot: DS.Snapshot,
        updatedSnapshots: DS.Snapshot[],
        relationship: string,
        url: string,
        isBulk: boolean = false,
    ): Promise<any> {
        return this._doRelatedRequest(store, snapshot, updatedSnapshots, relationship, url, 'PATCH', isBulk)
            .then(res => {
                const relatedType = singularize(snapshot.record[relationship].meta().type);
                res.data.forEach(item => {
                    const record = store.push(store.normalize(relatedType, item));
                    // TODO: This is now called addCanonicalInternalModel :|
                    snapshot.record.resolveRelationship(relationship).addCanonicalInternalModel(record._internalModel);
                });
                return res;
            });
    },
    /**
     * Handle removal of related resources. This differs from DELETEs in that the related
     * record is not deleted, just dissociated from the inverse record.
     *
     * @method _removeRelated
     * @private
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} removedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     */
    _removeRelated(
        this: OsfAdapter,
        store: DS.Store,
        snapshot: DS.Snapshot,
        removedSnapshots: DS.Snapshot[],
        relationship: string,
        url: string,
        isBulk: boolean = false,
    ): Promise<any> {
        return this._doRelatedRequest(store, snapshot, removedSnapshots, relationship, url, 'DELETE', isBulk)
            .then(res => {
                removedSnapshots.forEach(s =>
                    snapshot.record
                        .resolveRelationship(relationship)
                        .removeCanonicalInternalModel(s.record._internalModel));
                return res || [];
            });
    },
    /**
     * Handle deletion of related resources
     *
     * @method _deleteRelated
     * @private
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} deletedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     */
    _deleteRelated(
        this: OsfAdapter,
        store: DS.Store,
        snapshot: DS.Snapshot,
        deletedSnapshots: DS.Snapshot[],
    ): Promise<void> { // , relationship, url, isBulk = false) {
        return this._removeRelated(...arguments).then(() => {
            deletedSnapshots.forEach(s => s.record.unloadRecord());
        });
    },
    /**
     * A helper for making _*Related requests
     *
     * @method _doRelatedRequest
     * @private
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} relatedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {String} requestMethod
     * @param {Boolean} isBulk
     */
    _doRelatedRequest(
        this: OsfAdapter,
        store: DS.Store,
        snapshot: DS.Snapshot,
        relatedSnapshots: DS.Snapshot[],
        relationship: string,
        url: string,
        requestMethod: string,
        isBulk: boolean = false,
    ) {
        const data: { data?: any[] } = {};
        const relatedMeta: any = snapshot.record[relationship].meta();
        const type: string = singularize(relatedMeta.type);
        let serializer: DS.Serializer & { serializeIntoHash: any } = store.serializerFor(type);
        if (relatedMeta.options.serializerType) {
            serializer = store.serializerFor(relatedMeta.options.serializerType);
        }
        if (isArray(relatedSnapshots)) {
            data.data = relatedSnapshots.map(relatedSnapshot => {
                const item: { data?: any[] } = {};
                serializer.serializeIntoHash(
                    item,
                    store.modelFor(type),
                    relatedSnapshot, {
                        forRelationship: true,
                        isBulk,
                    },
                );
                if (isArray(item.data) && item.data.length === 1) {
                    return item.data[0];
                }
                return item.data;
            });
        } else {
            serializer.serializeIntoHash(
                data,
                store.modelFor(type),
                relatedSnapshots, {
                    forRelationship: true,
                    isBulk,
                },
            );
        }
        return this.ajax(url, requestMethod, {
            data,
            isBulk,
        }).then(res => {
            if (res && !$.isArray(res.data)) {
                res.data = [res.data];
            }

            return res;
        });
    },
    /**
     * Delegate a series of requests based on a snapshot, relationship, and a change.
     * The change argument can be 'delete', 'remove', 'update', 'add', 'create'
     *
     * @method _handleRelatedRequest
     * @private
     * @param {DS.Store} store
     * @param {DS.Model} type
     * @param {DS.Snapshot} snapshot
     * @param {String} relationship
     * @param {String} change
     */
    _handleRelatedRequest(
        this: OsfAdapter,
        store: DS.Store,
        type: { modelName: string },
        snapshot: DS.Snapshot,
        relationship: string,
        change: string,
    ): any {
        let related: any[] | { record?: any } = snapshot.record
            .get(`_dirtyRelationships.${relationship}.${change}`)
            .map(r => (r._internalModel ? r._internalModel.createSnapshot() : r.createSnapshot()));

        if (!related.length) {
            return [];
        }

        const relatedMeta: { options: any } = snapshot.record[relationship].meta();
        const url: string = this._buildRelationshipURL(snapshot, relationship);
        const adapter: DS.Adapter = store.adapterFor(type.modelName);
        const allowBulk: boolean = relatedMeta.options[`allowBulk${capitalize(change)}`];

        if (related.record) {
            related = [related];
        }

        const response: any = adapter[`_${change}Related`](
            store,
            snapshot,
            related,
            relationship,
            url,
            allowBulk,
        );
        return response;
    },
    updateRecord(this: OsfAdapter, store: DS.Store, type: { modelName: string }, snapshot: DS.Snapshot): any {
        const relatedRequests = {};
        const dirtyRelationships = snapshot.record.get('_dirtyRelationships');
        Object.keys(dirtyRelationships).forEach(relationship => {
            let promises = [];
            const changed = dirtyRelationships[relationship];
            Object.keys(changed).forEach(change => {
                promises = promises
                    .concat(this._handleRelatedRequest(store, type, snapshot, relationship, change) || []);
            });
            if (promises.length) {
                relatedRequests[relationship] = allSettled(promises);
            }
        });
        const relatedPromise = hashSettled(relatedRequests);

        if (Object.keys(snapshot.record.changedAttributes()).length) {
            return this._super(...arguments).then(response => relatedPromise.then(() => response));
        }

        return relatedPromise.then(() => null);
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
