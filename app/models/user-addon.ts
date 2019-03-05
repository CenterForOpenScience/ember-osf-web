import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';
import AccountModel from './account';
import OsfModel from './osf-model';
import UserModel from './user';

export default class UserAddonModel extends OsfModel {
    @attr('boolean') userHasAuth!: boolean;

    @belongsTo('user', { inverse: 'addons' })
    user!: DS.PromiseObject<UserModel> & UserModel;

    @belongsTo('account', { inverse: 'addon' })
    account!: DS.PromiseObject<AccountModel> & AccountModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-addon': UserAddonModel;
    } // eslint-disable-line semi
}
