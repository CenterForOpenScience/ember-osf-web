import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';
import config from 'ember-get-config';
import { Link } from 'jsonapi-typescript';

import SparseNodeModel from 'ember-osf-web/models/sparse-node';
import ContributorModel from './contributor';
import FileModel from './file';
import InstitutionModel from './institution';
import NodeModel from './node';
import OsfModel, { OsfLinks } from './osf-model';
import RegionModel from './region';
import RegistrationModel from './registration';
import UserEmailModel from './user-email';
import UserSettingModel from './user-setting';

const { OSF: { apiUrl } } = config;

const { attr, belongsTo, hasMany } = DS;

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

export interface UserLinks extends OsfLinks {
    profile_image: Link; // eslint-disable-line camelcase
}

export interface Employment {
    title: string;
    endYear: number;
    ongoing: boolean;
    endMonth: number;
    startYear: number;
    department: string;
    startMonth: number;
    institution: string;
}

export default class UserModel extends OsfModel.extend(Validations) {
    @attr() links!: UserLinks;
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
    @attr('array') employment!: Employment[];

    @belongsTo('region', { async: false })
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

    @hasMany('sparse-node', { inverse: null })
    sparseNodes!: DS.PromiseArray<SparseNodeModel>;

    // Calculated fields
    @alias('links.html') profileURL!: string;
    @alias('links.profile_image') profileImage!: string;

    @action
    claimUnregisteredUser(nodeId: string, email?: string) {
        const url = `${apiUrl}/users/${this.id}/claim`;
        return this.currentUser.authenticatedAJAX({
            url,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                attributes: {
                    email,
                    id: nodeId,
                },
            }),
        });
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        user: UserModel;
    } // eslint-disable-line semi
}
