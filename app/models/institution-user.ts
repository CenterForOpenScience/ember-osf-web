import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import UserModel from 'ember-osf-web/models/user';

import OsfModel from './osf-model';

export default class InstitutionUserModel extends OsfModel {
    @attr('fixstring') userName!: string;
    @attr('fixstring') department?: string;
    @attr('number') publicProjects!: number;
    @attr('number') privateProjects!: number;

    @belongsTo('user', { async: true })
    user!: AsyncBelongsTo<UserModel> & UserModel;

    get userGuid() {
        return (this as InstitutionUserModel).belongsTo('user').id();
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'institution-user': InstitutionUserModel;
    } // eslint-disable-line semi
}
