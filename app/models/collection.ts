import { attr, hasMany } from '@ember-decorators/data';
import Node from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 collections
 *
 * @class Collection
 */
export default class Collection extends OsfModel {
    @attr('fixstring') title: string;
    @attr('date') dateCreated: Date;
    @attr('date') dateModified: Date;
    @attr('boolean') bookmarks: boolean;

    @hasMany('node', {
        inverse: null,
        serializerType: 'linked-node',
    })
    linkedNodes: Node[];

    @hasMany('registration', {
        inverse: null,
        serializerType: 'linked-node',
    })
    linkedRegistrations: Registration[];
}

declare module 'ember-data' {
    interface ModelRegistry {
        'collection': Collection;
    }
}
