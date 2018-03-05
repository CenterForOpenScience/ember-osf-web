import DS from 'ember-data';
import Node from './node';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 registrations. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Registration_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Children_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/User_Registrations_GET
 *
 * @class Registration
 */
export default class Registration extends Node.extend({
    dateRegistered: DS.attr('date'),
    pendingRegistrationApproval: DS.attr('boolean'),
    embargoEndDate: DS.attr('date'),
    pendingEmbargoApproval: DS.attr('boolean'),
    withdrawn: DS.attr('boolean'),
    withdrawalJustification: DS.attr('fixstring'),
    pendingWithdrawal: DS.attr('boolean'),

    draftRegistration: DS.attr('fixstring'),
    registrationChoice: DS.attr('fixstring'),
    // TODO: doesnt seem to be an actual field
    liftEmbargo: DS.attr('object'),

    registrationSupplement: DS.attr('fixstring'),
    registeredMeta: DS.attr('object'),

    registeredFrom: DS.belongsTo('node', {
        inverse: 'registrations',
    }),
    registeredBy: DS.belongsTo('user', {
        inverse: null,
    }),
    contributors: DS.hasMany('contributors'),
    comments: DS.hasMany('comments'),
}) {
  // normal class body definition here
}


declare module 'ember-data' {
    interface ModelRegistry {
        'registration': Registration;
    }
}
