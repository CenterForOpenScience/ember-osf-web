import { attr } from '@ember-data/model';

import OsfModel from './osf-model';

export default class AddonModel extends OsfModel {
    @attr('string') name!: string;
    @attr('array') category!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        addon: AddonModel;
    } // eslint-disable-line semi
}
