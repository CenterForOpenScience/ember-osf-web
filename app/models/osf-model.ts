import { attr } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import DS, { ModelRegistry } from 'ember-data';
import CurrentUser from 'ember-osf-web/services/current-user';

const { Model } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

export interface QueryHasManyResult<T> extends Array<T> {
    meta: {
        total: number;
        per_page: number; // eslint-disable-line camelcase
    };
    links?: any;
    version: string;
}

/**
 * Common properties and behaviors shared by all OSF APIv2 models
 *
 * @class OsfModel
 * @public
 */

export default class OsfModel extends Model {
    @service store!: DS.Store;
    @service currentUser!: CurrentUser;

    @attr() links: any;
    @attr() apiMeta: any;

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
    async queryHasMany<T>(
        this: OsfModel,
        propertyName: any,
        queryParams?: object,
        ajaxOptions?: object,
    ): Promise<QueryHasManyResult<T>> {
        const store = this.get('store');

        const reference = this.hasMany(propertyName);

        // HACK: ember-data discards/ignores the link if an object on the belongsTo side
        // came first. In that case, grab the link where we expect it from OSF's API
        const url: string = reference.link() || this.links.relationships.get(propertyName).links.related.href;

        if (!url) {
            throw new Error(`Could not find a link for '${propertyName}' relationship`);
        }

        const options: object = {
            url,
            data: queryParams,
            ...ajaxOptions,
        };

        const payload = await this.currentUser.authenticatedAJAX(options);

        store.pushPayload(payload);

        const records = payload.data
            .map((datum: { type: keyof ModelRegistry, id: string }) => store.peekRecord(datum.type, datum.id));

        const { meta, links } = payload;

        return Object.assign(records, { meta, links });
    }
}
