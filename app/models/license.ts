import { attr } from '@ember-decorators/data';

import { Deserialized } from 'ember-osf-web/transforms/node-license';

import OsfModel from './osf-model';

export default class LicenseModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('fixstring') url!: string;
    @attr('fixstring') text!: string;
    @attr('array') requiredFields!: Array<keyof Deserialized>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        license: LicenseModel;
    } // eslint-disable-line semi
}
