import { attr, hasMany } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import DS from 'ember-data';
import File from './file';
import Institution from './institution';
import Node from './node';
import OsfModel from './osf-model';
import Registration from './registration';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 users. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 *
 * @class User
 */
export default class User extends OsfModel {
    @attr('fixstring') fullName: string;
    @attr('fixstring') givenName: string;
    @attr('array') middleNames: string[];
    @attr('fixstring') familyName: string;

    @attr('date') dateRegistered: Date;
    // email
    @attr('fixstring') username: string;

    @attr('boolean', { defaultValue: false }) canViewReviews: boolean;

    @hasMany('node') nodes: DS.PromiseManyArray<Node>;
    @hasMany('registration') registrations: DS.PromiseManyArray<Registration>;

    @hasMany('file') quickfiles: DS.PromiseManyArray<File>;

    @hasMany('institution', { inverse: 'users' }) institutions: DS.PromiseManyArray<Institution>;

    // Calculated fields
    @alias('links.html') profileURL: string;
    @alias('links.profile_image') profileImage: string;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'user': User;
    }
}
