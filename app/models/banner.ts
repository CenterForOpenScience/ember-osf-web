import { attr } from '@ember-decorators/data';

import OsfModel from './osf-model';

export default class BannerModel extends OsfModel {
    @attr('date') startDate!: Date;
    @attr('date') endDate!: Date;
    @attr('string') name!: string;
    @attr('string') link!: string;
    @attr('string') mobileAltText!: string;
    @attr('string') defaultAltText!: string;
    @attr('string') license!: string;
    @attr('string') color!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        banner: BannerModel;
    } // eslint-disable-line semi
}
