import { AsyncBelongsTo, AsyncHasMany, attr, belongsTo, hasMany } from '@ember-data/model';
import RegistrationModel from 'ember-osf-web/models/registration';
import RegistrationSchemaModel from 'ember-osf-web/models/registration-schema';
import SchemaResponseActionModel from 'ember-osf-web/models/schema-response-action';
import UserModel from 'ember-osf-web/models/user';
import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema';

import OsfModel from './osf-model';

export enum RevisionReviewStates {
    RevisionInProgress = 'revision_in_progress',
    RevisionPendingAdminApproval = 'revision_pending_admin_approval',
    RevisionPendingModeration = 'revision_pending_moderation',
    Approved = 'approved',
}

export default class SchemaResponseModel extends OsfModel {
    @attr('fixstring') reviewsState!: RevisionReviewStates;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('fixstring') revisionJustification!: string;
    @attr('registration-response-key-array') revisedResponses!: string[];
    @attr('registration-responses') revisionResponses!: RegistrationResponse;
    @attr('boolean') isPendingCurrentUserApproval!: boolean;

    @belongsTo('user') initiatedBy!: AsyncBelongsTo<UserModel> & UserModel;
    @belongsTo('registration') registration!: AsyncBelongsTo<RegistrationModel> & RegistrationModel;
    @belongsTo('registration-schema')
    registrationSchema!: AsyncBelongsTo<RegistrationSchemaModel> & RegistrationSchemaModel;
    @hasMany('schema-response-action', { inverse: 'target' })
    actions!: AsyncHasMany<SchemaResponseActionModel> | SchemaResponseActionModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'schema-response': SchemaResponseModel;
    } // eslint-disable-line semi
}
