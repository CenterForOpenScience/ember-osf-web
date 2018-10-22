import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';
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
    @attr('date') date!: Date;
    @attr('fixstring') action!: string;
    @attr('object') params!: any;
    @belongsTo('node', { inverse: null }) node!: DS.PromiseObject<Node> & Node;
    @belongsTo('node', { inverse: 'logs' }) originalNode!: DS.PromiseObject<Node> & Node;
    @belongsTo('user') user!: DS.PromiseObject<User> & User;
    @belongsTo('node', { inverse: null }) linkedNode!: DS.PromiseObject<Node> & Node;
    @belongsTo('node', { inverse: null }) templateNode!: DS.PromiseObject<Node> & Node;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        log: Log;
    } // eslint-disable-line semi
}
