import { attr, hasMany } from '@ember-decorators/data';
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
export default class Collection extends OsfModel {
    @attr('fixstring') title;
    @attr('date') dateCreated;
    @attr('date') dateModified;
    @attr('boolean') bookmarks;

    @hasMany('node', {
        inverse: null,
        serializerType: 'linked-node',
    })
    linkedNodes;

    @hasMany('registration', {
        inverse: null,
        serializerType: 'linked-node',
    })
    linkedRegistrations;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'collection': Collection;
    }
}
