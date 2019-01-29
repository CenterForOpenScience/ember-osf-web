import { attr } from '@ember-decorators/data';
import OsfModel from './osf-model';

export default class UserAddonModel extends OsfModel {
    @attr('fixstring') name!: string;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
      addon: UserAddonModel;
  } // eslint-disable-line semi
}
