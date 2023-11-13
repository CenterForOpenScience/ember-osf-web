import { AsyncBelongsTo, AsyncHasMany, attr, belongsTo, hasMany } from '@ember-data/model';

import AddonModel from 'ember-osf-web/models/addon';
import ExternalAccountsModel from 'ember-osf-web/models/external-accounts';
import UserModel from 'ember-osf-web/models/user';

import OsfModel from './osf-model';


export default class UserAddonModel extends OsfModel {
    @attr('boolean') userHasAuth!: boolean;

    @hasMany('external-accounts', { inverse: null })
    externalAccounts!: AsyncHasMany<ExternalAccountsModel> & ExternalAccountsModel[];

    @belongsTo('user', { inverse: 'userAddons' })
    user!: AsyncBelongsTo<UserModel> & UserModel;

    @belongsTo('addon', { inverse: null })
    addon!: AsyncBelongsTo<AddonModel>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-addon': UserAddonModel;
    } // eslint-disable-line semi
}
