import { attr, belongsTo } from '@ember-decorators/data';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';
import OsfModel from './osf-model';
import UserAddonModel from './user-addon';

const Validations = buildValidations({
    profileUrl: validator('presence', true),
});

export default class AccountModel extends OsfModel.extend(Validations) {
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
