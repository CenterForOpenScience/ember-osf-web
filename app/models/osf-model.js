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
export default DS.Model.extend({
    links: DS.attr('links'),
    embeds: DS.attr('embed'),

    relationshipLinks: alias('links.relationships'),
    _dirtyRelationships: null,
    isNewOrDirty() {
        return this.get('isNew') || Object.keys(this.changedAttributes()).length;
    },
    init() {
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
    resolveRelationship(rel) {
        let relation;
        const meta = this[rel].meta();
        if (meta.kind === 'hasMany') {
            relation = this.hasMany(rel).hasManyRelationship;
        } else if (meta.kind === 'belongsTo') {
            relation = this.belongsTo(rel).belongsToRelationship;
        }
        return relation;
    },
    save(options = {
        adapterOptions: {},
    }) {
        if (options.adapterOptions.nested) {
            return this._super(...arguments);
        }

        this.set('_dirtyRelationships', {});
        this.eachRelationship((rel) => {
            const relation = this.resolveRelationship(rel);

            if (relation.hasData) {
                const canonicalIds = relation.canonicalMembers.list.map(member => member.getRecord().get('id'));
                const currentIds = relation.members.list.map(member => member.getRecord().get('id'));
                const changes = {
                    create: relation.members.list.filter(m => m.getRecord().get('isNew')),
                    add: relation.members.list.filter(m => !m.getRecord().get('isNew') && canonicalIds.indexOf(m.getRecord().get('id')) === -1),
                    remove: relation.canonicalMembers.list.filter(m => currentIds.indexOf(m.getRecord().get('id')) === -1),
                };

                const other = this.get(`_dirtyRelationships.${rel}`) || {};
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
    queryHasMany(propertyName, queryParams, ajaxOptions) {
        const reference = this.hasMany(propertyName);
        const promise = new EmberPromise((resolve, reject) => {
            // HACK: ember-data discards/ignores the link if an object on the belongsTo side
            // came first. In that case, grab the link where we expect it from OSF's API
            const url = reference.link() || this.get(`links.relationships.${propertyName}.links.related.href`);
            if (!url) {
                reject(`Could not find a link for '${propertyName}' relationship`);
                return;
            }
            const options = merge({
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

    __queryHasManyDone(resolve, payload) {
        const store = this.get('store');
        store.pushPayload(payload);
        const records = payload.data.map(datum => store.peekRecord(datum.type, datum.id));
        records.meta = payload.meta;
        records.links = payload.links;
        resolve(records);
    },
});
