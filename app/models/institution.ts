import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import DS from 'ember-data';

import InstitutionSummaryMetricsModel from 'ember-osf-web/models/institution-summary-metric';
import InstitutionDepartmentsModel from './institution-department';
import InstitutionUserModel from './institution-user';
import NodeModel from './node';
import OsfModel, { OsfLinks } from './osf-model';
import RegistrationModel from './registration';
import UserModel from './user';

const { attr, hasMany } = DS;

export interface InstitutionLinks extends OsfLinks {
    csv: string;
}

/* eslint-disable camelcase */
export interface Assets {
    banner: string;
    logo: string;
    logo_rounded: string;
}
/* eslint-enable camelcase */

export interface Department {
    name: string;
    numUsers: number;
}

export default class InstitutionModel extends OsfModel {
    @attr() links!: InstitutionLinks;
    @attr('string') name!: string;
    @attr('fixstring') description!: string;
    @attr('string') logoPath!: string;
    @attr('string') authUrl!: string;
    @attr('object') assets!: Partial<Assets>;
    @attr('boolean', { defaultValue: false }) currentUserIsAdmin!: boolean;
    @attr('date') lastUpdated!: Date;

    // TODO Might want to replace calls to `users` with `institutionUsers.user`?
    @hasMany('user', { inverse: 'institutions' })
    users!: DS.PromiseManyArray<UserModel>;

    @hasMany('node', { inverse: 'affiliatedInstitutions' })
    nodes!: DS.PromiseManyArray<NodeModel>;

    @hasMany('registration', { inverse: 'affiliatedInstitutions' })
    registrations!: DS.PromiseManyArray<RegistrationModel>;

    @hasMany('institution-department')
    institutionDepartments!: DS.PromiseManyArray<InstitutionDepartmentsModel>;

    @hasMany('institution-user')
    institutionUsers!: DS.PromiseManyArray<InstitutionUserModel>;

    @hasMany('institution-summary-metric')
    institutionSummaryMetrics!: DS.PromiseManyArray<InstitutionSummaryMetricsModel>;

    // This is for the title helper, which does its own encoding of unsafe characters
    @computed('name')
    get unsafeName() {
        return htmlSafe(this.name);
    }

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
