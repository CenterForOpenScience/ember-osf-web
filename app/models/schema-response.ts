import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import RegistrationModel from 'ember-osf-web/models/registration';
import RegistrationSchemaModel from 'ember-osf-web/models/registration-schema';
import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema';

import OsfModel from './osf-model';

export default class SchemaResponseModel extends OsfModel {
    @attr('string') title!: string;
    @attr('registration-responses') responses!: RegistrationResponse;
    @attr('boolean') deleted!: boolean;
    @attr('boolean') public!: boolean;

    @belongsTo('registration') registration!: AsyncBelongsTo<RegistrationModel> & RegistrationModel;

    @belongsTo('registration-schema')
    registrationSchema!: AsyncBelongsTo<RegistrationSchemaModel> & RegistrationSchemaModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'schema-response': SchemaResponseModel;
    } // eslint-disable-line semi
}
