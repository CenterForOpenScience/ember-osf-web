import { attr, belongsTo, hasMany, AsyncBelongsTo, AsyncHasMany } from '@ember-data/model';
import { buildValidations, validator } from 'ember-cp-validations';

import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import ResourceModel from 'ember-osf-web/models/resource';
import ReviewActionModel, { ReviewActionTrigger } from 'ember-osf-web/models/review-action';
import SchemaResponseModel, { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema';

import CommentModel from './comment';
import ContributorModel from './contributor';
import InstitutionModel from './institution';
import NodeModel from './node';
import RegistrationProviderModel from './registration-provider';
import RegistrationSchemaModel, { RegistrationMetadata } from './registration-schema';
import { SchemaResponseActionTrigger } from './schema-response-action';
import UserModel from './user';

export enum RegistrationReviewStates {
    Initial = 'initial',
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
    Withdrawn = 'withdrawn',
    Embargo = 'embargo',
    PendingEmbargoTermination = 'pending_embargo_termination',
    PendingWithdrawRequest = 'pending_withdraw_request',
    PendingWithdraw = 'pending_withdraw',
}

export type NonActionableRegistrationStates = RegistrationReviewStates.Initial
    | RegistrationReviewStates.Withdrawn | RegistrationReviewStates.Rejected;

export type ActionableRegistrationStates = Exclude<RegistrationReviewStates, NonActionableRegistrationStates>;

export type ActionableRevisionStates = RevisionReviewStates.RevisionPendingModeration;

export type ReviewsStateToDecisionMap =
    Exclude<RegistrationReviewStates, NonActionableRegistrationStates> | RevisionReviewStates.RevisionPendingModeration;
export const reviewsStateToDecisionMap: {
    [index in ReviewsStateToDecisionMap]: Array<
        Exclude<
            ReviewActionTrigger,
            ReviewActionTrigger.Submit
            | ReviewActionTrigger.RequestWithdrawal
            | ReviewActionTrigger.RequestEmbargoTermination>
        |
        Exclude<
            SchemaResponseActionTrigger,
            SchemaResponseActionTrigger.SubmitRevision
            | SchemaResponseActionTrigger.AdminApproveRevision
            | SchemaResponseActionTrigger.AdminRejectRevision
        >
    >
} = {
    [RegistrationReviewStates.Accepted]: [ReviewActionTrigger.ForceWithdraw],
    [RegistrationReviewStates.Embargo]: [ReviewActionTrigger.ForceWithdraw],
    [RegistrationReviewStates.Pending]:
        [ReviewActionTrigger.AcceptSubmission, ReviewActionTrigger.RejectSubmission],
    [RegistrationReviewStates.PendingWithdraw]:
        [ReviewActionTrigger.AcceptWithdrawal, ReviewActionTrigger.RejectWithdrawal],
    [RegistrationReviewStates.PendingWithdrawRequest]: [ReviewActionTrigger.ForceWithdraw],
    [RegistrationReviewStates.PendingEmbargoTermination]: [ReviewActionTrigger.ForceWithdraw],
    [RevisionReviewStates.RevisionPendingModeration]:
        [SchemaResponseActionTrigger.AcceptRevision, SchemaResponseActionTrigger.RejectRevision],
};

const Validations = buildValidations({
    license: [
        validator('presence', {
            presence: true,
        }),
    ],
    nodeLicense: [
        validator('presence', {
            presence: true,
        }),
        validator('node-license', {
            on: 'license',
        }),
    ],
});

export interface ProviderMetadata {
    // eslint-disable-next-line camelcase
    field_name: string;
    // eslint-disable-next-line camelcase
    field_value: string;
}

export default class RegistrationModel extends NodeModel.extend(Validations) {
    @attr('date') dateRegistered!: Date;
    @attr('boolean') pendingRegistrationApproval!: boolean;
    @attr('boolean') archiving!: boolean;
    @attr('boolean') embargoed!: boolean;
    @attr('date') embargoEndDate!: Date | null;
    @attr('boolean') pendingEmbargoApproval!: boolean;
    @attr('boolean') pendingEmbargoTerminationApproval!: boolean;
    @attr('boolean') withdrawn!: boolean;
    @attr('date') dateWithdrawn!: Date | null;
    @attr('fixstring') withdrawalJustification?: string;
    @attr('boolean') pendingWithdrawal!: boolean;
    @attr('fixstring') registrationSupplement?: string;
    @attr('fixstring') articleDoi!: string | null;
    @attr('object') registeredMeta!: RegistrationMetadata;
    @attr('registration-responses') registrationResponses!: RegistrationResponse;
    @attr('fixstring') reviewsState!: RegistrationReviewStates;
    @attr('fixstring') iaUrl?: string;
    @attr('array') providerSpecificMetadata!: ProviderMetadata[];
    @attr('fixstring') revisionState!: RevisionReviewStates;
    @attr('boolean') wikiEnabled!: boolean;
    @attr('boolean') hasData!: boolean;
    @attr('boolean') hasMaterials!: boolean;
    @attr('boolean') hasAnalyticCode!: boolean;
    @attr('boolean') hasPapers!: boolean;
    @attr('boolean') hasSupplements!: boolean;

    // Write-only attributes
    @attr('array') includedNodeIds?: string[];
    @attr('fixstring') draftRegistrationId?: string;

    @belongsTo('node', { inverse: 'registrations' })
    registeredFrom!: AsyncBelongsTo<NodeModel> & NodeModel;

    @belongsTo('user', { inverse: null })
    registeredBy!: AsyncBelongsTo<UserModel> & UserModel;

    @belongsTo('registration-provider', { inverse: 'registrations' })
    provider!: AsyncBelongsTo<RegistrationProviderModel> & RegistrationProviderModel;

    @hasMany('contributor', { inverse: 'node' })
    contributors!: AsyncHasMany<ContributorModel> & ContributorModel[];

    @hasMany('comment', { inverse: 'node' })
    comments!: AsyncHasMany<CommentModel>;

    @belongsTo('registration-schema', { inverse: null })
    registrationSchema!: AsyncBelongsTo<RegistrationSchemaModel> & RegistrationSchemaModel;

    @belongsTo('registration', { inverse: 'children' })
    parent!: AsyncBelongsTo<RegistrationModel> & RegistrationModel;

    @belongsTo('registration', { inverse: null })
    root!: AsyncBelongsTo<RegistrationModel> & RegistrationModel;

    @hasMany('registration', { inverse: 'parent' })
    children!: AsyncHasMany<RegistrationModel>;

    @hasMany('institution', { inverse: 'registrations' })
    affiliatedInstitutions!: AsyncHasMany<InstitutionModel> | InstitutionModel[];

    @hasMany('review-action', { inverse: 'target' })
    reviewActions!: AsyncHasMany<ReviewActionModel> | ReviewActionModel[];

    @hasMany('schema-response', { inverse: 'registration' })
    schemaResponses!: AsyncHasMany<SchemaResponseModel> | SchemaResponseModel[];

    @belongsTo('schema-response', { inverse: null })
    originalResponse!: AsyncBelongsTo<SchemaResponseModel> | SchemaResponseModel;

    @belongsTo('schema-response', { inverse: null })
    latestResponse!: AsyncBelongsTo<SchemaResponseModel> & SchemaResponseModel; // Latest accepted response

    @hasMany('resource', { inverse: 'registration' })
    resources!: AsyncHasMany<ResourceModel> | ResourceModel[];

    // Write-only relationships
    @belongsTo('draft-registration', { inverse: null })
    draftRegistration!: DraftRegistrationModel;

    get resourcesVisible(): boolean {
        return ![
            RegistrationReviewStates.Initial,
            RegistrationReviewStates.Pending,
        ].includes(this.reviewsState) && !this.withdrawn && !this.archiving;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        registration: RegistrationModel;
    } // eslint-disable-line semi
}
