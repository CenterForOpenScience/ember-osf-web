import Ember from 'ember';
import DS from 'ember-data';

import OsfModel from './osf-model';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 users. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/User_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/User_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Institution_User_List_GET
 * @class User
 */
export default OsfModel.extend({
    fullName: DS.attr('fixstring'),
    givenName: DS.attr('fixstring'),
    middleNames: DS.attr(),
    familyName: DS.attr('fixstring'),

    dateRegistered: DS.attr('date'),
    // email
    username: DS.attr('fixstring'),

    canViewReviews: DS.attr('boolean', { defaultValue: false }),

    nodes: DS.hasMany('nodes'),
    registrations: DS.hasMany('registrations'),

    quickfiles: DS.hasMany('files'),

    affiliatedInstitutions: DS.hasMany('institutions', {
        inverse: 'users',
    }),

    // Calculated fields
    profileURL: Ember.computed.alias('links.html'),
    profileImage: Ember.computed.alias('links.profile_image'),
});
