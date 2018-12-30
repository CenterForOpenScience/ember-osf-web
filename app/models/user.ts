import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';

import ContributorModel from './contributor';
import FileModel from './file';
import InstitutionModel from './institution';
import NodeModel from './node';
import OsfModel from './osf-model';
import RegionModel from './region';
import RegistrationModel from './registration';
import UserEmailModel from './user-email';
import UserSettingModel from './user-setting';

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
export default class UserModel extends OsfModel.extend(Validations) {
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

    @belongsTo('region')
    defaultRegion!: DS.PromiseObject<RegionModel> & RegionModel;

    @belongsTo('user-setting', { inverse: 'user', async: false })
    settings?: UserSettingModel | null;

    @hasMany('node')
    nodes!: DS.PromiseManyArray<NodeModel>;

    @hasMany('contributor')
    contributors!: DS.PromiseManyArray<ContributorModel>;

    @hasMany('registration')
    registrations!: DS.PromiseManyArray<RegistrationModel>;

    @hasMany('file')
    quickfiles!: DS.PromiseManyArray<FileModel>;

    @hasMany('institution', { inverse: 'users' })
    institutions!: DS.PromiseManyArray<InstitutionModel>;

    @hasMany('user-email', { inverse: 'user' })
    emails!: DS.PromiseManyArray<UserEmailModel>;

    // Calculated fields
    @alias('links.html') profileURL!: string;
    @alias('links.profile_image') profileImage!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        user: UserModel;
    } // eslint-disable-line semi
}
