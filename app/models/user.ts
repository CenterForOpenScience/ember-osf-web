import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';
import Contributor from './contributor';
import File from './file';
import Institution from './institution';
import Node from './node';
import OsfModel from './osf-model';
import Region from './region';
import Registration from './registration';
import UserEmail from './user-email';
import UserSetting from './user-setting';

/**
 * @module ember-osf-web
 * @submodule models
 */

const Validations = buildValidations({
    acceptedTermsOfService: [
        validator('affirmation', {
            messageKey: 'affirm_terms',
        }),
    ],
    fullName: [
        validator('presence', true),
        validator('length', {
            max: 186,
            min: 3,
        }),
    ],
    givenName: [
        validator('length', {
            max: 255,
        }),
    ],
    familyName: [
        validator('length', {
            max: 255,
        }),
    ],
    middleNames: [
        validator('length', {
            max: 255,
        }),
    ],
    suffix: [
        validator('length', {
            max: 255,
        }),
    ],
});

/**
 * Model for OSF APIv2 users. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 *
 * @class User
 */
export default class User extends OsfModel.extend(Validations) {
    @attr('fixstring') fullName!: string;
    @attr('fixstring') givenName!: string;
    @attr('fixstring') middleNames!: string;
    @attr('fixstring') familyName!: string;
    @attr('fixstring') suffix!: string;

    @attr('fixstring') locale!: string;
    @attr('fixstring') timezone!: string;

    @attr('date') dateRegistered!: Date;

    @attr('boolean', { defaultValue: false }) canViewReviews!: boolean;

    @attr('boolean') acceptedTermsOfService?: boolean;
    @attr('boolean') active!: boolean;
    @attr('object') social!: {};

    @belongsTo('region') defaultRegion!: DS.PromiseObject<Region> & Region;
    @belongsTo('user-setting', { inverse: 'user' }) settings!: DS.PromiseObject<UserSetting> & UserSetting;

    @hasMany('node') nodes!: DS.PromiseManyArray<Node>;
    @hasMany('contributor') contributors!: DS.PromiseManyArray<Contributor>;
    @hasMany('registration') registrations!: DS.PromiseManyArray<Registration>;

    @hasMany('file') quickfiles!: DS.PromiseManyArray<File>;

    @hasMany('institution', { inverse: 'users' }) institutions!: DS.PromiseManyArray<Institution>;

    @hasMany('user-email', { inverse: 'user' }) emails!: DS.PromiseManyArray<UserEmail>;

    // Calculated fields
    @alias('links.html') profileURL!: string;
    @alias('links.profile_image') profileImage!: string;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'user': User;
    }
}
