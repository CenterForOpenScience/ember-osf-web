import { AsyncBelongsTo, AsyncHasMany, attr, belongsTo, hasMany } from '@ember-data/model';
import RegistrationModel from 'ember-osf-web/models/registration';
import RegistrationSchemaModel from 'ember-osf-web/models/registration-schema';
import RevisionActionModel from 'ember-osf-web/models/revision-action';
import UserModel from 'ember-osf-web/models/user';
import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema';

import OsfModel from './osf-model';

export enum RevisionReviewStates {
    RevisionInProgress = 'revision_in_progress',
    RevisionPendingAdminApproval = 'revision_pending_admin_approval',
    RevisionPendingModeration = 'revision_pendping_moderation',
    Approved = 'approved',
}

export default class RevisionModel extends OsfModel {
    @attr('fixstring') reviewState!: RevisionReviewStates;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('fixstring') revisionJustification!: string;
    @attr('array') revisedResponses!: string[];
    @attr('registration-responses') revisionResponses!: RegistrationResponse;
    @attr('boolean') isPendingCurrentUserApproval!: boolean;

    @belongsTo('user') initiatedBy!: AsyncBelongsTo<UserModel> & UserModel;
    @belongsTo('registration') registration!: AsyncBelongsTo<RegistrationModel> & RegistrationModel;
    @belongsTo('registration-schema')
    registrationSchema!: AsyncBelongsTo<RegistrationSchemaModel> & RegistrationSchemaModel;
    @hasMany('revision-action') actions!: AsyncHasMany<RevisionActionModel> & RevisionActionModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'revision': RevisionModel;
    } // eslint-disable-line semi
}
