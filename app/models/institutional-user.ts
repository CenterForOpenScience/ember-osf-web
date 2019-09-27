import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';

import InstitutionModel from 'ember-osf-web/models/institution';
import UserModel from 'ember-osf-web/models/user';
import OsfModel from './osf-model';

export default class InstitutionalUserModel extends OsfModel {
    @attr('fixstring') department?: string;
    @attr('number') publicProjectCount!: number;
    @attr('number') privateProjectCount!: number;

    @belongsTo('institution')
    institution!: DS.PromiseObject<InstitutionModel> & InstitutionModel;

    @belongsTo('user')
    user!: DS.PromiseObject<UserModel> & UserModel;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'institutional-user': InstitutionalUserModel;
    } // eslint-disable-line semi
}
