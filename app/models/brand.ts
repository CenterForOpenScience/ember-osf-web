import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr } = DS;

export default class BrandModel extends OsfModel {
    @attr('string') primaryColor!: string;
    @attr('string') secondaryColor!: string;
    @attr('string') navbarLogoImage!: string;
    @attr('string') heroLogoImage!: string;
    @attr('string') heroBackgroundImage!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        brand: BrandModel;
    } // eslint-disable-line semi
}
