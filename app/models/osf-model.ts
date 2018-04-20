import { attr } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import { get } from '@ember/object';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import authenticatedAJAX from 'ember-osf-web/utils/ajax-helpers';

const { Model } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

interface QueryHasManyPayload {
    meta: object;
    links: object;
    data: any[];
}

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

export default class OsfModel extends Model.extend({
    queryHasManyTask: task(function* (
        this: OsfModel,
        propertyName: string,
        queryParams?: object,
        ajaxOptions?: object,
    ) {
        const store = this.get('store');

        const reference = this.hasMany(propertyName);

        // HACK: ember-data discards/ignores the link if an object on the belongsTo side
        // came first. In that case, grab the link where we expect it from OSF's API
        const url: string = reference.link() || this.get(`links.relationships.${propertyName}.links.related.href`);
        if (!url) {
            throw new Error(`Could not find a link for '${propertyName}' relationship`);
        }

        const options: object = {
            url,
            data: queryParams,
            headers: get(store.adapterFor(this.constructor.modelName), 'headers'),
            ...ajaxOptions,
        };

        const payload = yield authenticatedAJAX(options);

        store.pushPayload(payload);
        const records: QueryHasManyResult =
            payload.data.map(datum => store.peekRecord(datum.type, datum.id));
        records.meta = payload.meta;
        records.links = payload.links;
        return records;
    }),
}) {
    @attr links: any;

    @alias('links.relationships') relationshipLinks: any;

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
        queryParams?: object,
        ajaxOptions?: object,
    ) {
        return this.get('queryHasManyTask').perform(propertyName, queryParams, ajaxOptions);
    }
}

declare module 'ember-data' {
    interface ModelRegistry {
        'osf-model': OsfModel;
    }
}
