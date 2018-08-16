import { attr } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { set } from '@ember/object';
import { dasherize, underscore } from '@ember/string';
import { task } from 'ember-concurrency';
import DS, { ModelRegistry } from 'ember-data';
import { singularize } from 'ember-inflector';

import CurrentUser from 'ember-osf-web/services/current-user';

import OSFAPI from 'osf-api';

const { Model } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

export enum Permission {
    Read = 'read',
    Write = 'write',
    Admin = 'admin',
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
    queryHasManyTask: task(function *(
        this: OsfModel,
        propertyName: any, // TODO constrain to DS.RelationshipsFor<M>
        queryParams?: object,
        ajaxOptions?: object,
    ) {
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

        const response: OSFAPI.Document = yield this.currentUser.authenticatedAJAX(options);

        if ('data' in response && Array.isArray(response.data)) {
            store.pushPayload(response);
            const records: QueryHasManyResult = response.data.map(
                datum => store.peekRecord(
                    (dasherize(singularize(datum.type)) as keyof ModelRegistry),
                    datum.id,
                ),
            );
            records.meta = response.meta;
            records.links = response.links;
            return records;
        } else if ('errors' in response) {
            throw new Error(response.errors.map(error => error.detail).join('\n'));
        } else {
            throw new Error(`Unexpected response while loading relationship ${this.modelName}.${propertyName}`);
        }
    }),
}) {
    @service store!: DS.Store;
    @service currentUser!: CurrentUser;

    @attr() links: any;
    @attr('object', { defaultValue: () => ({}) }) relatedCounts!: { [relName: string]: number | undefined };
    @attr() apiMeta: any;

    @alias('links.relationships') relationshipLinks: any;

    @alias('constructor.modelName') modelName!: string & keyof ModelRegistry;

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

    /*
     * Load related count for a given relationship using sparse fieldsets.
     *
     * @method loadRelatedCount
     * @param {String} relationshipName Name of a hasMany relationship on the model
     * @returns {Promise} Promise that will resolve when count is loaded
     */
    async loadRelatedCount(this: OsfModel, relationshipName: string) {
        const apiModelName = this.store.adapterFor(this.modelName).pathForType(this.modelName);
        const apiRelationshipName = underscore(relationshipName);
        const errorContext = `while loading related counts for ${this.modelName}.${relationshipName}`;

        // Get related count with sparse fieldset.
        const response: OSFAPI.Document = await this.currentUser.authenticatedAJAX({
            url: this.links.self,
            data: {
                related_counts: apiRelationshipName,
                [`fields[${apiModelName}]`]: apiRelationshipName,
            },
        });

        if ('data' in response && !Array.isArray(response.data)) {
            if (response.data.relationships && apiRelationshipName in response.data.relationships) {
                const relationship = response.data.relationships[apiRelationshipName];
                if ('links' in relationship) {
                    set(this.relatedCounts, relationshipName, relationship.links.related.meta.count);
                } else {
                    throw new Error(`Relationship link not found ${errorContext}`);
                }
            } else {
                throw new Error(`Relationship not serialized ${errorContext}`);
            }
        } else if ('errors' in response) {
            throw new Error(response.errors.map(error => error.detail).concat(errorContext).join('\n'));
        } else {
            throw new Error(`Unexpected response ${errorContext}`);
        }
    }
}
