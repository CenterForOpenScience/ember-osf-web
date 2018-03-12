import { alias } from '@ember/object/computed';
import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr, hasMany } = DS;

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
    fullName: attr('fixstring'),
    givenName: attr('fixstring'),
    middleNames: attr('array'),
    familyName: attr('fixstring'),

    dateRegistered: attr('date'),
    // email
    username: attr('fixstring'),

    canViewReviews: attr('boolean', { defaultValue: false }),

    nodes: hasMany('node'),
    registrations: hasMany('registration'),

    quickfiles: hasMany('file'),

    institutions: hasMany('institution', {
        inverse: 'users',
    }),
}) {
    // Calculated fields
    profileURL = alias('links.html');
    profileImage = alias('links.profile_image');
}

declare module 'ember-data' {
    interface ModelRegistry {
        'user': User;
    }
}
