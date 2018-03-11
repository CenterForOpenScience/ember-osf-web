import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr, hasMany } = DS;

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
    title: attr('fixstring'),
    dateCreated: attr('date'),
    dateModified: attr('date'),
    bookmarks: attr('boolean'),
    linkedNodes: hasMany('node', {
        inverse: null,
        serializerType: 'linked-node',
    }),
    linkedRegistrations: hasMany('registration', {
        inverse: null,
        serializerType: 'linked-node',
    }),
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
        'collection': Collection;
    }
}
