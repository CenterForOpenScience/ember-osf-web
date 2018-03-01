import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ArrayProxy from '@ember/array/proxy';
import { bind } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';
import { merge } from '@ember/polyfills';
import EmberObject, { get } from '@ember/object';
import { alias } from '@ember/object/computed';
import DS from 'ember-data';
import authenticatedAJAX from 'ember-osf-web/utils/ajax-helpers';

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
    links: DS.attr('links'),
    embeds: DS.attr('embed'),

    relationshipLinks: alias('links.relationships'),
    isNewOrDirty(): boolean | number {
        return this.get('isNew') || Object.keys(this.changedAttributes()).length;
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
     * */
    resolveRelationship(rel: string): DS.hasMany | DS.belongsTo {
        let relation: DS.hasMany | DS.belongsTo;
        const meta: {kind: string} = this[rel].meta();
        if (meta.kind === 'hasMany') {
            relation = this.hasMany(rel).hasManyRelationship;
        } else if (meta.kind === 'belongsTo') {
            relation = this.belongsTo(rel).belongsToRelationship;
        }
        return relation;
    },

    save(options = { adapterOptions: { nested: null } }): any {
        if (options.adapterOptions.nested) {
            return this._super(...arguments);
        }

        this.set('_dirtyRelationships', {});
        this.eachRelationship((rel) => {
            const relation: DS.hasMany | DS.belongsTo = this.resolveRelationship(rel);

            if (relation.hasData) {
                const canonicalIds: string[] = relation.canonicalMembers.list.map(member => member.getRecord().get('id'));
                const currentIds: string[] = relation.members.list.map(member => member.getRecord().get('id'));
                const changes: object = {
                    create: relation.members.list.filter(m => m.getRecord().get('isNew')),
                    add: relation.members.list.filter(m => !m.getRecord().get('isNew') && canonicalIds.indexOf(m.getRecord().get('id')) === -1),
                    remove: relation.canonicalMembers.list.filter(m => currentIds.indexOf(m.getRecord().get('id')) === -1),
                };

                const other: object = this.get(`_dirtyRelationships.${rel}`) || {};
                merge(other, changes);
                this.set(`_dirtyRelationships.${rel}`, other);
            }
        });
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
        const reference: DS.hasMany = this.hasMany(propertyName);
        const promise: PromiseLike<any> = new EmberPromise((resolve, reject) => {
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

        const ArrayPromiseProxy = ArrayProxy.extend(PromiseProxyMixin);
        return ArrayPromiseProxy.create({ promise });
    },

    __queryHasManyDone(resolve: Function, payload: {meta: object, links: object, data: Array<any>}): void {
        const store: DS.Store = this.get('store');
        store.pushPayload(payload);
        const records: Array<any> & {meta?: object, links?: object} = payload.data.map(datum => store.peekRecord(datum.type, datum.id));
        records.meta = payload.meta;
        records.links = payload.links;
        resolve(records);
    },
    _dirtyRelationships: null,
});


export default OsfModel;
// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data' {
    interface ModelRegistry {
        'osf-model': OsfModel;
    }
}
