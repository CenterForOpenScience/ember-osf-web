import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';
import OsfModel from './osf-model';
import UserAddonModel from './user-addon';

export default class AccountModel extends OsfModel {
    @attr('fixstring') displayName!: string;
    @attr('fixstring') profileUrl!: string;
    @attr('fixstring') provider!: string;

    @belongsTo('user-addon', { inverse: 'account' })
    addon!: DS.PromiseObject<UserAddonModel> & UserAddonModel;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
      account: AccountModel;
  } // eslint-disable-line semi
}
