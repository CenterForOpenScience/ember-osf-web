import DS from 'ember-data';
import OsfModel from './osf-model';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 log entries. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Node_Log_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Log_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Log_List_GET
 * @class Log
 */
export default class Log extends OsfModel.extend({
    date: DS.attr('date'),
    action: DS.attr('fixstring'),
    params: DS.attr('object'),
    node: DS.belongsTo('node', {
        inverse: null,
    }),
    originalNode: DS.belongsTo('node', {
        inverse: 'logs',
    }),
    user: DS.belongsTo('user'),
    linkedNode: DS.belongsTo('node', {
        inverse: null,
    }),
    templateNode: DS.belongsTo('node', {
        inverse: null,
    }),
}) {
  // normal class body definition here
}


declare module 'ember-data' {
    interface ModelRegistry {
        'log': Log;
    }
}
