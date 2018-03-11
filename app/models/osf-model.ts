import ArrayProxy from '@ember/array/proxy';
import EmberObject, { get } from '@ember/object';
import { alias } from '@ember/object/computed';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { merge } from '@ember/polyfills';
import { bind } from '@ember/runloop';
import DS from 'ember-data';
import authenticatedAJAX from 'ember-osf-web/utils/ajax-helpers';
import { Promise as EmberPromise } from 'rsvp';

const { attr, belongsTo, hasMany } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Common properties and behaviors shared by all OSF APIv2 models
 *
 * @class OsfModel
 * @public
 */

const OsfModel = DS.Model.extend({
    links: attr('links'),
    embeds: attr('embed'),

    relationshipLinks: alias('links.relationships'),
    isNewOrDirty(): boolean {
        return this.get('isNew') || !!Object.keys(this.changedAttributes()).length;
    },

    init(): void {
        this._super(...arguments);
        this.set('_dirtyRelationships', EmberObject.create({}));
    },

    /**
     * Looks up relationship on model and returns hasManyRelationship
     * or belongsToRelationship object.
     *
     * @method resolveRelationship
     * @private
     * @param {String} rel Name of the relationship on the model
     */
    resolveRelationship(rel: string): typeof hasMany | typeof belongsTo | void {
        const meta: {kind: string} = this[rel].meta();

        if (meta.kind === 'hasMany') {
            return this.hasMany(rel).hasManyRelationship;
        } else if (meta.kind === 'belongsTo') {
            return this.belongsTo(rel).belongsToRelationship;
        }
    },

    save(options = { adapterOptions: { nested: null } }): any {
        if (options.adapterOptions.nested) {
            return this._super(...arguments);
        }

        this.set('_dirtyRelationships', {});

        this.eachRelationship(rel => {
            const relation: hasMany|belongsTo = this.resolveRelationship(rel);

            if (relation.hasData) {
                const canonicalIds: string[] = relation.canonicalMembers.list
                    .map(member => member.getRecord().get('id'));
                const currentIds: string[] = relation.members.list.map(member => member.getRecord().get('id'));
                const changes: object = {
                    create: relation.members.list.filter(m => m.getRecord().get('isNew')),
                    add: relation.members.list
                        .filter(m => !m.getRecord().get('isNew') && !canonicalIds.includes(m.getRecord().get('id'))),
                    remove: relation.canonicalMembers.list
                        .filter(m => !currentIds.includes(m.getRecord().get('id'))),
                };

                const other: object = this.get(`_dirtyRelationships.${rel}`) || {};
                merge(other, changes);
                this.set(`_dirtyRelationships.${rel}`, other);
            }
        }, this);

        return this._super(...arguments);
    },

    /*
     * Query a hasMany relationship with query params
     *
     * @method queryHasMany
     * @param {String} propertyName Name of a hasMany relationship on the model
     * @param {Object} queryParams A hash to be serialized into the query string of the request
     * @param {Object} [ajaxOptions] A hash of options to be passed to jQuery.ajax
     * @returns {ArrayPromiseProxy} Promise-like array proxy, resolves to the records fetched
     */
    queryHasMany(propertyName: string, queryParams: object, ajaxOptions: object): any | null {
        const reference: typeof hasMany = this.hasMany(propertyName);
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

    __queryHasManyDone(resolve: (records: any) => void, payload: {meta: object, links: object, data: any[]}): void {
        const store: DS.Store = this.get('store');
        store.pushPayload(payload);
        const records: any[] & {meta?: object, links?: object} = payload.data
            .map(datum => store.peekRecord(datum.type, datum.id));
        records.meta = payload.meta;
        records.links = payload.links;
        resolve(records);
    },
    _dirtyRelationships: null,
});

export default OsfModel;

declare module 'ember-data' {
    interface ModelRegistry {
        'osf-model': OsfModel;
    }
}
