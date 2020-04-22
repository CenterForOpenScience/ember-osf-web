import { alias } from '@ember/object/computed';
import DS from 'ember-data';

import UserModel from 'ember-osf-web/models/user';

import OsfModel from './osf-model';

const { attr, belongsTo } = DS;

export default class InstitutionalUserModel extends OsfModel {
    @attr('fixstring') userName!: string;
    @attr('fixstring') department?: string;
    @attr('number') publicProjects!: number;
    @attr('number') privateProjects!: number;

    @belongsTo('user', { async: false })
    user!: DS.PromiseObject<UserModel> & UserModel;

    @alias('user.id') userGuid!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'institutional-user': InstitutionalUserModel;
    } // eslint-disable-line semi
}
