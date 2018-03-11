import DS from 'ember-data';
import Node from './node';

const { attr, belongsTo, hasMany } = DS;

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 registrations. This model may be used with one of several API endpoints. It may be queried
 * directly, or accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Registration_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Children_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/User_Registrations_GET
 *
 * @class Registration
 */
export default class Registration extends Node.extend({
    dateRegistered: attr('date'),
    pendingRegistrationApproval: attr('boolean'),
    embargoEndDate: attr('date'),
    pendingEmbargoApproval: attr('boolean'),
    withdrawn: attr('boolean'),
    withdrawalJustification: attr('fixstring'),
    pendingWithdrawal: attr('boolean'),

    draftRegistration: attr('fixstring'),
    registrationChoice: attr('fixstring'),
    // TODO: doesnt seem to be an actual field
    liftEmbargo: attr('object'),

    registrationSupplement: attr('fixstring'),
    registeredMeta: attr('object'),

    registeredFrom: belongsTo('node', {
        inverse: 'registrations',
    }),
    registeredBy: belongsTo('user', {
        inverse: null,
    }),
    contributors: hasMany('contributor'),
    comments: hasMany('comment'),
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
        'registration': Registration;
    }
}
