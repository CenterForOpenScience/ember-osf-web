import { attr, belongsTo } from '@ember-decorators/data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 log entries. This model may be used with one of several API endpoints. It may be queried
 * directly, or accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Node_Log_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Log_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Log_List_GET
 * @class Log
 */
export default class Log extends OsfModel {
    @attr('date') date;
    @attr('fixstring') action;
    @attr('object') params;
    @belongsTo('node', { inverse: null }) node;
    @belongsTo('node', { inverse: 'logs' }) originalNode;
    @belongsTo('user') user;
    @belongsTo('node', { inverse: null }) linkedNode;
    @belongsTo('node', { inverse: null }) templateNode;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'log': Log;
    }
}
