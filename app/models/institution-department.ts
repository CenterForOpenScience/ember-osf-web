import { attr } from '@ember-data/model';

import OsfModel from './osf-model';

export default class InstitutionDepartmentModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('number') numberOfUsers!: number;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'institution-department': InstitutionDepartmentModel;
    } // eslint-disable-line semi
}
