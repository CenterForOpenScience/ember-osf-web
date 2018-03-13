import ArrayProxy from '@ember/array/proxy';
import { get } from '@ember/object';
import { alias } from '@ember/object/computed';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { merge } from '@ember/polyfills';
import { bind } from '@ember/runloop';
import DS from 'ember-data';
import authenticatedAJAX from 'ember-osf-web/utils/ajax-helpers';
import { Promise as EmberPromise } from 'rsvp';

const { attr, Model } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

interface QueryHasManyResult extends Array<any> {
    meta?: any;
    links?: any;
}

/**
 * Common properties and behaviors shared by all OSF APIv2 models
 *
 * @class OsfModel
 * @public
 */

const OsfModel = Model.extend({
    links: attr('links'),

    relationshipLinks: alias('links.relationships'),

    /*
     * Query a hasMany relationship with query params
     *
     * @method queryHasMany
     * @param {String} propertyName Name of a hasMany relationship on the model
     * @param {Object} queryParams A hash to be serialized into the query string of the request
     * @param {Object} [ajaxOptions] A hash of options to be passed to jQuery.ajax
     * @returns {ArrayPromiseProxy} Promise-like array proxy, resolves to the records fetched
     */
    queryHasMany(
        this: OsfModel,
        propertyName: string,
        queryParams: object,
        ajaxOptions: object,
    ): any | null {
        const reference = this.hasMany(propertyName);
        const promise: Promise<any> = new EmberPromise((resolve, reject) => {
            // HACK: ember-data discards/ignores the link if an object on the belongsTo side
            // came first. In that case, grab the link where we expect it from OSF's API
            const url: string = reference.link() || this.get(`links.relationships.${propertyName}.links.related.href`);
            if (!url) {
                reject(`Could not find a link for '${propertyName}' relationship`);
                return;
            }
            const options: object = merge({
                url,
                data: queryParams,
                headers: get(this.store.adapterFor(this.constructor.modelName), 'headers'),
            }, ajaxOptions);

            authenticatedAJAX(options).then(
                bind(this, this.__queryHasManyDone, resolve),
                reject,
            );
        });

        const ArrayPromiseProxy: PromiseProxyMixin = ArrayProxy.extend(PromiseProxyMixin);
        return ArrayPromiseProxy.create({ promise });
    },

    __queryHasManyDone(
        this: OsfModel,
        resolve: (QueryHasManyResult) => void,
        payload: {meta: object, links: object, data: any[]},
    ): void {
        const store = this.get('store');
        store.pushPayload(payload);
        const records: QueryHasManyResult =
            payload.data.map(datum => store.peekRecord(datum.type, datum.id));
        records.meta = payload.meta;
        records.links = payload.links;
        resolve(records);
    },
});

export default OsfModel;

declare module 'ember-data' {
    interface ModelRegistry {
        'osf-model': OsfModel;
    }
}
