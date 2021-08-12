import { attr } from '@ember-data/model';
import OsfModel from './osf-model';

export default class BrandModel extends OsfModel {
    @attr('string') primaryColor!: string;
    @attr('string') secondaryColor!: string;
    @attr('string') topnavLogoImage!: string;
    @attr('string') heroLogoImage!: string;
    @attr('string') heroBackgroundImage!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        brand: BrandModel;
    } // eslint-disable-line semi
}
