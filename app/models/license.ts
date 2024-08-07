import { attr } from '@ember-data/model';

import { NodeLicense } from 'ember-osf-web/models/node';

import OsfModel from './osf-model';

export default class LicenseModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('fixstring') url!: string;
    @attr('fixstring') text!: string;
    @attr('array') requiredFields!: Array<keyof NodeLicense>;

    get hasRequiredFields(): boolean {
        return this.requiredFields?.length > 0;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        license: LicenseModel;
    } // eslint-disable-line semi
}
