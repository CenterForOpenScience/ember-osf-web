import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import RegistrationModel from 'ember-osf-web/models/registration';

import OsfModel from './osf-model';

export enum resourceTypes {
    DATA = 1,
    MATERIALS = 11,
}

export default class ResourceModel extends OsfModel {
    @attr('fixstring') pid!: string;
    @attr('fixstring') name!: string;
    @attr('number') resourceType!: number;
    @attr('fixstring') description!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') finalized!: boolean;

    @belongsTo('registration', { inverse: 'resources' })
    registration!: AsyncBelongsTo<RegistrationModel> & RegistrationModel;

}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        resource: ResourceModel;
    } // eslint-disable-line semi
}
