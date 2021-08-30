import { attr } from '@ember-data/model';

import OsfModel from './osf-model';

export default class RegionModel extends OsfModel {
    @attr('string') name!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        region: RegionModel;
    } // eslint-disable-line semi
}
