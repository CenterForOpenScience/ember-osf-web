import DS from 'ember-data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 collections
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Collection_List_GET
 *
 * @class Collection
 */
export default class Collection extends OsfModel.extend({
    title: DS.attr('fixstring'),
    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),
    bookmarks: DS.attr('boolean'),
    linkedNodes: DS.hasMany('nodes', {
        inverse: null,
        serializerType: 'linked-node',
    }),
    linkedRegistrations: DS.hasMany('registrations', {
        inverse: null,
        serializerType: 'linked-node',
    }),
}) {
  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data' {
    interface ModelRegistry {
        'collection': Collection;
    }
}
