import { attr, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import DS from 'ember-data';

import InstitutionalUserModel from './institutional-user';
import NodeModel from './node';
import OsfModel from './osf-model';
import RegistrationModel from './registration';
import UserModel from './user';

/* eslint-disable camelcase */
export interface Assets {
    banner: string;
    logo: string;
    logo_rounded: string;
}
/* eslint-enable camelcase */

export interface StatSummary {
    departments: Department[];
    ssoUsersConnected: number;
    numPrivateProjects: number;
    numPublicProjects: number;
}

export interface Department {
    name: string;
    numUsers: number;
}

export default class InstitutionModel extends OsfModel {
    @attr('string') name!: string;
    @attr('fixstring') description!: string;
    @attr('string') logoPath!: string;
    @attr('string') authUrl!: string;
    @attr('object') assets!: Partial<Assets>;
    @attr('boolean', { defaultValue: false }) currentUserIsAdmin!: boolean;
    @attr('object') statSummary!: StatSummary;
    @attr('date') lastUpdated!: Date;

    @hasMany('institutional-user', { inverse: 'institution' })
    institutionalUsers!: DS.PromiseManyArray<InstitutionalUserModel>;

    // TODO Might want to replace calls to `users` with `institutionalUsers.user`?
    @hasMany('user', { inverse: 'institutions' })
    users!: DS.PromiseManyArray<UserModel>;

    @hasMany('node', { inverse: 'affiliatedInstitutions' })
    nodes!: DS.PromiseManyArray<NodeModel>;

    @hasMany('registration', { inverse: 'affiliatedInstitutions' })
    registrations!: DS.PromiseManyArray<RegistrationModel>;

    @computed('assets', 'assets.logo', 'logoPath', 'id')
    get logoUrl(): string {
        if (this.assets && this.assets.logo) {
            return this.assets.logo;
        } else if (this.logoPath) {
            return this.logoPath;
        }
        return `/static/img/institutions/shields-rounded-corners/${this.id}-shield-rounded-corners.png`;
    }

    @computed('assets', 'assets.logo_rounded', 'logoUrl')
    get logoRoundedUrl(): string {
        if (this.assets && this.assets.logo_rounded) {
            return this.assets.logo_rounded;
        }
        return this.logoUrl;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        institution: InstitutionModel;
    } // eslint-disable-line semi
}
