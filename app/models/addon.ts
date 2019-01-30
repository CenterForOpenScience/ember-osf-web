import { attr } from '@ember-decorators/data';
import OsfModel from './osf-model';

export default class AddonModel extends OsfModel {
    @attr('fixstring') name!: string;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
      addon: AddonModel;
  } // eslint-disable-line semi
}
