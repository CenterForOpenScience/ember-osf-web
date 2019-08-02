import { attr } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import EmberArray, { A } from '@ember/array';
import { assert } from '@ember/debug';
import { set } from '@ember/object';
import { dasherize, underscore } from '@ember/string';
import { Validations } from 'ember-cp-validations';
import DS, { RelationshipsFor } from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import { pluralize, singularize } from 'ember-inflector';
import { Links, PaginationLinks } from 'jsonapi-typescript';

import CurrentUser from 'ember-osf-web/services/current-user';
import getHref from 'ember-osf-web/utils/get-href';
import getRelatedHref from 'ember-osf-web/utils/get-related-href';
import getSelfHref from 'ember-osf-web/utils/get-self-href';
import {
    buildFieldsParam,
    parseSparseResource,
    SparseFieldset,
    SparseModel,
} from 'ember-osf-web/utils/sparse-fieldsets';

import {
    BaseMeta,
    Document as ApiResponseDocument,
    NormalLinks,
    PaginatedMeta,
    Relationships,
    ResourceCollectionDocument,
} from 'osf-api';

const { Model } = DS;

export enum Permission {
    Read = 'read',
    Write = 'write',
    Admin = 'admin',
}

type RelationshipType<T, R extends keyof T> = T[R] extends EmberArray<infer U> ? U : never;

export interface QueryHasManyResult<T> extends Array<T> {
    meta: PaginatedMeta;
    links?: Links | PaginationLinks;
}

export interface RequestOptions {
    queryParams?: object;
    ajaxOptions?: object;
}

export interface SparseHasManyResult {
    sparseModels: SparseModel[];
    meta: PaginatedMeta;
    links?: Links | PaginationLinks;
}

export interface PaginatedQueryOptions {
    'page[size]': number;
    page: number;
}

export interface OsfLinks extends NormalLinks {
    relationships?: Relationships;
}

export type ValidatedModelName = {
    [K in keyof ModelRegistry]: ModelRegistry[K] extends (Validations & DS.Model) ? K : never
}[keyof ModelRegistry];

export default class OsfModel extends Model {
    @service store!: DS.Store;
    @service currentUser!: CurrentUser;

    @attr() links!: OsfLinks;
    @attr('object', { defaultValue: () => ({}) }) relatedCounts!: { [relName: string]: number };
    @attr() apiMeta!: BaseMeta;

    @alias('links.relationships') relationshipLinks!: Relationships;

    @alias('constructor.modelName') modelName!: string & keyof ModelRegistry;

    get apiType() {
        return pluralize(underscore(this.modelName));
    }

    getHasManyLink<T extends OsfModel, R extends RelationshipsFor<T>>(
        this: T,
        relationshipName: R,
    ): string {
        const reference = this.hasMany(relationshipName);

        // HACK: ember-data discards/ignores the link if an object on the belongsTo side
        // came first. In that case, grab the link where we expect it from OSF's API
        const url = reference.link() || getRelatedHref(this.relationshipLinks[relationshipName as string]);
        if (!url) {
            throw new Error(`Could not find a link for '${relationshipName}' relationship`);
        }
        return url;
    }

    /*
     * Query a hasMany relationship with query params
     *
     * @method queryHasMany
     * @param {String} propertyName Name of a hasMany relationship on the model
     * @param {Object} queryParams A hash to be serialized into the query string of the request
     * @param {Object} [ajaxOptions] A hash of options to be passed to jQuery.ajax
     * @returns {ArrayPromiseProxy} Promise-like array proxy, resolves to the records fetched
     */
    async queryHasMany<
    T extends OsfModel,
    R extends RelationshipsFor<T>,
    RT = RelationshipType<T, R>
    >(
        this: T,
        propertyName: R,
        queryParams?: object,
        ajaxOptions?: object,
    ): Promise<QueryHasManyResult<RT>> {
        const options: object = {
            url: this.getHasManyLink(propertyName),
            data: queryParams,
            ...ajaxOptions,
        };

        const response: ApiResponseDocument = await this.currentUser.authenticatedAJAX(options);

        if ('data' in response && Array.isArray(response.data)) {
            this.store.pushPayload(response);

            const records = response.data.map(
                datum => this.store.peekRecord(
                    (dasherize(singularize(datum.type)) as keyof ModelRegistry),
                    datum.id,
                ) as RT | null,
            ).filter((v): v is RT => Boolean(v));

            const { meta, links } = response as ResourceCollectionDocument;
            return Object.assign(A(records), { meta, links });
        } else if ('errors' in response) {
            throw new Error(response.errors.map(error => error.detail).join('\n'));
        } else {
            throw new Error(`Unexpected response while loading relationship ${this.modelName}.${propertyName}`);
        }
    }

    /*
     * Load all values for a hasMany relationship with query params and automatic depagination.
     *
     * @method loadAll
     * @param {String} relationshipName Name of a hasMany relationship on the model
     * @param {Object} queryParams A hash to be serialized into the query string of the request
     * @param {Number} [totalPreviouslyLoaded] The number of results previously loaded (used for recursion)
     * @returns {ArrayPromiseProxy} Promise-like array proxy, resolves to the records fetched
     */
    async loadAll<
    T extends OsfModel,
    R extends RelationshipsFor<T>,
    >(
        this: T,
        relationshipName: R,
        queryParams: PaginatedQueryOptions = { 'page[size]': 100, page: 1 },
        totalPreviouslyLoaded = 0,
    ): Promise<QueryHasManyResult<RelationshipType<T, R>>> {
        const currentResults = await this.queryHasMany(relationshipName, queryParams);

        const { meta: { total } } = currentResults;

        const totalLoaded = totalPreviouslyLoaded + currentResults.length;

        if (totalLoaded < total) {
            currentResults.pushObjects(
                await this.loadAll(
                    relationshipName,
                    { ...queryParams, page: (queryParams.page || 0) + 1 },
                    totalLoaded,
                ),
            );
        }

        return currentResults;
    }

    async createM2MRelationship<T extends OsfModel>(
        this: T,
        relationshipName: RelationshipsFor<T> & string,
        relatedModel: OsfModel,
    ) {
        return this.modifyM2MRelationship('post', relationshipName, relatedModel);
    }

    async deleteM2MRelationship<T extends OsfModel>(
        this: T,
        relationshipName: RelationshipsFor<T> & string,
        relatedModel: OsfModel,
    ) {
        return this.modifyM2MRelationship('delete', relationshipName, relatedModel);
    }

    async modifyM2MRelationship<T extends OsfModel>(
        this: T,
        action: 'post' | 'delete',
        relationshipName: RelationshipsFor<T> & string,
        relatedModel: OsfModel,
    ) {
        const apiRelationshipName = underscore(relationshipName);
        const url = getSelfHref(this.relationshipLinks[apiRelationshipName]);

        const data = JSON.stringify({
            data: [{
                id: relatedModel.id,
                type: relatedModel.apiType,
            }],
        });

        if (!url) {
            throw new Error(`Couldn't find self link for ${apiRelationshipName} relationship`);
        }
        assert(`The related object is required to ${action} a relationship`, Boolean(relatedModel));

        const options: JQuery.AjaxSettings = {
            url,
            type: action.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        };

        return this.currentUser.authenticatedAJAX(options);
    }

    /*
     * Load related count for a given relationship using sparse fieldsets.
     *
     * @method loadRelatedCount
     * @param {String} relationshipName Name of a hasMany relationship on the model
     * @returns {Promise} Promise that will resolve when count is loaded
     */
    async loadRelatedCount<T extends OsfModel>(this: T, relationshipName: RelationshipsFor<T> & string) {
        const apiModelName = this.store.adapterFor(this.modelName).pathForType(this.modelName);
        const apiRelationshipName = underscore(relationshipName);
        const errorContext = `while loading related counts for ${this.modelName}.${relationshipName}`;

        if (!this.links.self) {
            throw new Error(`Unable to find self link on ${this.modelName} ${this.id} ${errorContext}`);
        }

        // Get related count with sparse fieldset.
        const response: ApiResponseDocument = await this.currentUser.authenticatedAJAX({
            url: getHref(this.links.self!),
            data: {
                related_counts: apiRelationshipName,
                [`fields[${apiModelName}]`]: apiRelationshipName,
            },
        });

        if ('data' in response && !Array.isArray(response.data)) {
            if (response.data.relationships && apiRelationshipName in response.data.relationships) {
                const relationship = response.data.relationships[apiRelationshipName];
                if ('links' in relationship) {
                    if (typeof relationship.links.related === 'object') {
                        if (relationship.links.related.meta) {
                            if (typeof relationship.links.related.meta.count === 'number') {
                                set(this.relatedCounts, relationshipName, relationship.links.related.meta.count);
                            } else {
                                throw new Error(`Count not found in related link meta ${errorContext}`);
                            }
                        } else {
                            throw new Error(`Meta not found in related link ${errorContext}`);
                        }
                    } else {
                        throw new Error(`Related link not found in relationship links ${errorContext}`);
                    }
                } else {
                    throw new Error(`Relationship links not found ${errorContext}`);
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

    /**
     * Fetch one page of a has-many relationship using sparse fieldsets.
     * See https://developer.osf.io/#tag/Sparse-Fieldsets
     *
     * The API response includes only the specified fields.
     * This is useful for potentially long lists that require rendering only a few fields.
     *
     * Does NOT use ember-data. This means a few things:
     * - Attributes don't pass through the transforms (e.g. 'fixstring') set with `DS.attr`, they remain as
     *   represented in JSON. In particular, date fields are not deserialized to `Date` objects.
     * - Sparse models aren't put in the store. This means no potential interactions with code that does use
     *   the store, but if you want caching you'll have to do it yourself.
     *
     * Example:
     * ```ts
     * const contributors = await node.sparseHasMany(
     *     'contributors',
     *     { contributor: ['users'], user: ['fullName'] },
     *     { queryParams: { 'page[size]': 100 } },
     * });
     *
     * contributors.sparseModels.forEach(contrib => {
     *     console.log(contrib.users.fullName);
     * );
     * ```
     */
    async sparseHasMany<T extends OsfModel>(
        this: T,
        relationshipName: RelationshipsFor<T>,
        fieldset: SparseFieldset,
        options: RequestOptions = {},
    ): Promise<SparseHasManyResult> {
        const response: ResourceCollectionDocument = await this.currentUser.authenticatedAJAX({
            url: this.getHasManyLink(relationshipName),
            data: {
                fields: buildFieldsParam(fieldset),
                ...options.queryParams,
            },
            ...options.ajaxOptions,
        });

        const { data, meta, links } = response;

        return {
            sparseModels: data.map(parseSparseResource),
            meta,
            ...(links ? { links } : {}),
        };
    }

    /**
     * Fetch the entirety of a has-many relationship using sparse fieldsets.
     * See `sparseHasMany` above.
     */
    async sparseLoadAll<T extends OsfModel>(
        this: T,
        relationshipName: RelationshipsFor<T>,
        fieldset: SparseFieldset,
        options: RequestOptions = {},
    ): Promise<SparseModel[]> {
        const sparseModels: SparseModel[] = [];
        let page = 1;
        let totalPages = 0;

        do { // eslint-disable-next-line no-await-in-loop
            const response = await this.sparseHasMany(relationshipName, fieldset, {
                ...options,
                queryParams: {
                    ...options.queryParams,
                    page,
                    'page[size]': 100,
                },
            });

            sparseModels.push(...response.sparseModels);
            totalPages = Math.ceil(response.meta.total / response.meta.per_page);
            page++;
        } while (page <= totalPages);

        return sparseModels;
    }
}
