import { attr, belongsTo } from '@ember-decorators/data';
import Node from './node';
import OsfModel from './osf-model';
import User from './user';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 log entries. This model may be used with one of several API endpoints. It may be queried
 * directly, or accessed via relationship fields.
 *
 * @class Log
 */
export default class Log extends OsfModel {
    @attr('date') date: Date;
    @attr('fixstring') action: string;
    @attr('object') params: any;
    @belongsTo('node', { inverse: null }) node: Node;
    @belongsTo('node', { inverse: 'logs' }) originalNode: Node;
    @belongsTo('user') user: User;
    @belongsTo('node', { inverse: null }) linkedNode: Node;
    @belongsTo('node', { inverse: null }) templateNode: Node;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'log': Log;
    }
}
