import { attr } from '@ember-decorators/data';

import OsfModel from './osf-model';

export default class RegionModel extends OsfModel {
    @attr('string') name!: string; // eslint-disable-line no-restricted-globals
}

declare module 'ember-data' {
    interface ModelRegistry {
        'region': RegionModel;
    }
}
