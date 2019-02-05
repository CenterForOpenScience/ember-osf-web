import { attr } from '@ember-decorators/data';
import OsfModel from './osf-model';

export default class AddonModel extends OsfModel {
    @attr('fixstring') url!: string;
    @attr('fixstring') name!: string;
    @attr('fixstring') image!: string;
    @attr('array') categories!: string[];
    @attr('object') auth!: object;
    @attr('fixstring') description!: string;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
      addon: AddonModel;
  } // eslint-disable-line semi
}
