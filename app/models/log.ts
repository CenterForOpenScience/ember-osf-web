import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr, belongsTo } = DS;

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
export default class Log extends OsfModel.extend({
    date: attr('date'),
    action: attr('fixstring'),
    params: attr('object'),
    node: belongsTo('node', {
        inverse: null,
    }),
    originalNode: belongsTo('node', {
        inverse: 'logs',
    }),
    user: belongsTo('user'),
    linkedNode: belongsTo('node', {
        inverse: null,
    }),
    templateNode: belongsTo('node', {
        inverse: null,
    }),
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
        'log': Log;
    }
}
