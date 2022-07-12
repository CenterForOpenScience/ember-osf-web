import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import RegistrationModel from 'ember-osf-web/models/registration';

import OsfModel from './osf-model';

export enum outputTypes {
    DATA = 1,
    MATERIALS = 2,
}

export default class OutputModel extends OsfModel {
    @attr('fixstring') pid!: string;
    @attr('fixstring') name!: string;
    @attr('number') outputType!: number;
    @attr('fixstring') description!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') finalized!: boolean;

    @belongsTo('registration', { inverse: 'outputs' })
    registration!: AsyncBelongsTo<RegistrationModel> & RegistrationModel;

}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        output: OutputModel;
    } // eslint-disable-line semi
}
