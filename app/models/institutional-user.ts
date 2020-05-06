import DS from 'ember-data';

import InstitutionModel from 'ember-osf-web/models/institution';
import UserModel from 'ember-osf-web/models/user';

import OsfModel from './osf-model';

const { attr, belongsTo } = DS;

export default class InstitutionalUserModel extends OsfModel {
    @attr('fixstring') userFullName!: string;
    @attr('fixstring') userGuid!: string;
    @attr('fixstring') department?: string;
    @attr('number') publicProjectCount!: number;
    @attr('number') privateProjectCount!: number;

    @belongsTo('institution', { inverse: 'institutionalUsers' })
    institution!: DS.PromiseObject<InstitutionModel> & InstitutionModel;

    @belongsTo('user', { async: false })
    user!: DS.PromiseObject<UserModel> & UserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'institutional-user': InstitutionalUserModel;
    } // eslint-disable-line semi
}
