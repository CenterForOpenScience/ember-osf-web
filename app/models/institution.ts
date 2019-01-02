import { attr, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import DS from 'ember-data';

import NodeModel from './node';
import OsfModel from './osf-model';
import RegistrationModel from './registration';
import UserModel from './user';

export default class InstitutionModel extends OsfModel {
    @attr('string') name!: string;
    @attr('fixstring') description!: string;
    @attr('string') logoPath!: string;
    @attr('string') authUrl!: string;
    @attr('object') assets!: any;

    @hasMany('user', { inverse: 'institutions' })
    users!: DS.PromiseManyArray<UserModel>;

    @hasMany('node', { inverse: 'affiliatedInstitutions' })
    nodes!: DS.PromiseManyArray<NodeModel>;

    @hasMany('registration', { inverse: 'affiliatedInstitutions' })
    registrations!: DS.PromiseManyArray<RegistrationModel>;

    @computed('assets', 'id')
    get logoUrl(): string {
        let assetsUrl = '';
        if (this.assets) {
            const { logo } = this.assets;
            assetsUrl = logo;
        } else {
            assetsUrl = `/static/img/institutions/shields-rounded-corners/${this.id}-shield-rounded-corners.png`;
        }
        return assetsUrl;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        institution: InstitutionModel;
    } // eslint-disable-line semi
}
