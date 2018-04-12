import { attr, hasMany } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
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
export default class User extends OsfModel {
    @attr('fixstring') fullName;
    @attr('fixstring') givenName;
    @attr('array') middleNames;
    @attr('fixstring') familyName;

    @attr('date') dateRegistered;
    // email
    @attr('fixstring') username;

    @attr('boolean', { defaultValue: false }) canViewReviews;

    @hasMany('node') nodes;
    @hasMany('registration') registrations;

    @hasMany('file') quickfiles;

    @hasMany('institution', { inverse: 'users' }) institutions;

    // Calculated fields
    @alias('links.html') profileURL;
    @alias('links.profile_image') profileImage;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'user': User;
    }
}
