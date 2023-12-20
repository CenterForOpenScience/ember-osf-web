import { attr, belongsTo, hasMany, AsyncHasMany } from '@ember-data/model';
import { alias } from '@ember/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';
import config from 'ember-osf-web/config/environment';
import { Link } from 'jsonapi-typescript';

import PreprintModel from 'ember-osf-web/models/preprint';
import SparseNodeModel from 'ember-osf-web/models/sparse-node';
import UserAddonModel from 'ember-osf-web/models/user-addon';
import ContributorModel from './contributor';
import DraftRegistrationModel from './draft-registration';
import InstitutionModel from './institution';
import NodeModel from './node';
import OsfModel, { OsfLinks } from './osf-model';
import RegionModel from './region';
import RegistrationModel from './registration';
import UserEmailModel from './user-email';
import UserSettingModel from './user-setting';

const { OSF: { apiUrl, apiNamespace } } = config;

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
    html: Link;
    profile_image: Link; // eslint-disable-line camelcase
}

export interface Employment {
    title?: string;
    endYear?: number;
    ongoing?: boolean;
    endMonth?: number;
    startYear?: number;
    department?: string;
    startMonth?: number;
    institution?: string;
}

export interface Education {
    degree?: string;
    endYear?: string;
    startYear?: string;
    endMonth?: number;
    startMonth?: number;
    ongoing?: boolean;
    department?: string;
    institution?: string;
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
    @attr('array') education!: Education[];
    @attr('boolean', { allowNull: true }) allowIndexing?: boolean;

    @belongsTo('region', { async: false })
    defaultRegion!: RegionModel;

    @belongsTo('user-setting', { inverse: 'user', async: false })
    settings?: UserSettingModel | null;

    @hasMany('node')
    nodes!: AsyncHasMany<NodeModel>;

    @hasMany('contributor')
    contributors!: AsyncHasMany<ContributorModel>;

    @hasMany('registration')
    registrations!: AsyncHasMany<RegistrationModel>;

    @hasMany('draft-registration')
    draftRegistrations!: AsyncHasMany<DraftRegistrationModel>;

    @hasMany('preprint')
    preprints!: AsyncHasMany<PreprintModel>;

    @hasMany('institution', { inverse: 'users' })
    institutions!: AsyncHasMany<InstitutionModel>;

    @hasMany('user-email', { inverse: 'user' })
    emails!: AsyncHasMany<UserEmailModel>;

    @hasMany('sparse-node', { inverse: null })
    sparseNodes!: AsyncHasMany<SparseNodeModel>;

    @hasMany('user-addon', { inverse: 'user' })
    userAddons!: AsyncHasMany<UserAddonModel>;

    // Calculated fields
    @alias('links.html') profileURL!: string;
    @alias('links.profile_image') profileImage!: string;

    claimUnregisteredUser(nodeId: string, email?: string) {
        const url = `${apiUrl}/${apiNamespace}/users/${this.id}/claim/`;
        return this.currentUser.authenticatedAJAX({
            url,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                data: {
                    attributes: {
                        email,
                        id: nodeId,
                    },
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
