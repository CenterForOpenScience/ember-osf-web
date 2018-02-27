import { alias } from '@ember/object/computed';
import DS from 'ember-data';

import OsfModel from './osf-model';

/**
 * @module ember-osf-web
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
export default class User extends OsfModel.extend({
    fullName: DS.attr('fixstring'),
    givenName: DS.attr('fixstring'),
    middleNames: DS.attr('array'),
    familyName: DS.attr('fixstring'),

    dateRegistered: DS.attr('date'),
    // email
    username: DS.attr('fixstring'),

    canViewReviews: DS.attr('boolean', { defaultValue: false }),

    nodes: DS.hasMany('nodes'),
    registrations: DS.hasMany('registrations'),

    quickfiles: DS.hasMany('files'),

    institutions: DS.hasMany('institutions', {
        inverse: 'users',
    }),
}) {
    // Calculated fields
    profileURL = alias('links.html');
    profileImage = alias('links.profile_image');
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data' {
    interface ModelRegistry {
        'user': User;
    }
}
