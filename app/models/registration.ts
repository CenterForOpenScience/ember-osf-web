import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import Node from './node';

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
export default class Registration extends Node {
    @attr('date') dateRegistered;
    @attr('boolean') pendingRegistrationApproval;
    @attr('date') embargoEndDate;
    @attr('boolean') pendingEmbargoApproval;
    @attr('boolean') withdrawn;
    @attr('fixstring') withdrawalJustification;
    @attr('boolean') pendingWithdrawal;

    @attr('fixstring') draftRegistration;
    @attr('fixstring') registrationChoice;
    // TODO: doesnt seem to be an actual field
    @attr('object') liftEmbargo;

    @attr('fixstring') registrationSupplement;
    @attr('object') registeredMeta;

    @belongsTo('node', { inverse: 'registrations' }) registeredFrom;
    @belongsTo('user', { inverse: null }) registeredBy;
    @hasMany('contributor') contributors;
    @hasMany('comment') comments;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'registration': Registration;
    }
}
