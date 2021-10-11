import Store from '@ember-data/store';
import Component from '@glimmer/component';

import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import RouterService from '@ember/routing/router-service';
import RegistrationModel,
{
    RegistrationReviewStates,
    reviewsStateToDecisionMap,
    NonActionableRegistrationStates,
    ActionableRevisionStates,
} from 'ember-osf-web/models/registration';
import { ReviewActionTrigger } from 'ember-osf-web/models/review-action';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import { SchemaResponseActionTrigger } from 'ember-osf-web/models/schema-response-action';

interface Args {
    registration: RegistrationModel;
}

export default class MakeDecisionDropdown extends Component<Args> {
    @service intl!: Intl;
    @service store!: Store;
    @service toast!: Toast;
    @service router!: RouterService;

    @tracked decisionTrigger?: ReviewActionTrigger | SchemaResponseActionTrigger;
    @tracked comment?: string;

    reviewsStateToDecisionMap = reviewsStateToDecisionMap;
    actionTriggerToDescriptionMap = {
        [ReviewActionTrigger.ForceWithdraw]: this.intl.t('registries.makeDecisionDropdown.forceWithdrawDescription'),
        [ReviewActionTrigger.AcceptSubmission]:
            this.intl.t('registries.makeDecisionDropdown.acceptSubmissionDescription'),
        [ReviewActionTrigger.RejectSubmission]:
            this.intl.t('registries.makeDecisionDropdown.rejectSubmissionDescription'),
        [ReviewActionTrigger.AcceptWithdrawal]:
            this.intl.t('registries.makeDecisionDropdown.acceptWithdrawalDescription'),
        [ReviewActionTrigger.RejectWithdrawal]:
            this.intl.t('registries.makeDecisionDropdown.rejectWithdrawalDescription'),
        [SchemaResponseActionTrigger.AcceptRevision]:
            this.intl.t('registries.makeDecisionDropdown.acceptRevisionDescription'),
        [SchemaResponseActionTrigger.RejectRevision]:
            this.intl.t('registries.makeDecisionDropdown.rejectRevisionDescription'),
    };

    actionTriggerToTextMap = {
        [ReviewActionTrigger.ForceWithdraw]: this.intl.t('registries.makeDecisionDropdown.forceWithdraw'),
        [ReviewActionTrigger.AcceptSubmission]: this.intl.t('registries.makeDecisionDropdown.acceptSubmission'),
        [ReviewActionTrigger.RejectSubmission]: this.intl.t('registries.makeDecisionDropdown.rejectSubmission'),
        [ReviewActionTrigger.AcceptWithdrawal]: this.intl.t('registries.makeDecisionDropdown.acceptWithdrawal'),
        [ReviewActionTrigger.RejectWithdrawal]: this.intl.t('registries.makeDecisionDropdown.rejectWithdrawal'),
        [SchemaResponseActionTrigger.AcceptRevision]:
            this.intl.t('registries.makeDecisionDropdown.acceptRevision'),
        [SchemaResponseActionTrigger.RejectRevision]:
            this.intl.t('registries.makeDecisionDropdown.rejectRevision'),
    };

    get latestRevision() {
        return this.args.registration.schemaResponses.firstObject;
    }

    get revisionIsPending() {
        return (this.args.registration.reviewsState === RegistrationReviewStates.Accepted
        || this.args.registration.reviewsState === RegistrationReviewStates.Embargo)
        && this.args.registration.revisionState === RevisionReviewStates.RevisionPendingModeration;
    }

    get commentTextArea() {
        if (this.args.registration.reviewsState) {
            if ([RegistrationReviewStates.Pending, RegistrationReviewStates.PendingWithdraw]
                .includes(this.args.registration.reviewsState) ||
                this.revisionIsPending) {
                return {
                    label: this.intl.t('registries.makeDecisionDropdown.additionalComment'),
                    placeholder: this.intl.t('registries.makeDecisionDropdown.additionalCommentPlaceholder'),
                };
            }

            return {
                label: this.intl.t('registries.makeDecisionDropdown.justificationForWithdrawal'),
                placeholder: this.intl.t('registries.makeDecisionDropdown.justificationForWithdrawalPlaceholder'),
            };
        }
        // registration is viewed anonymously and this component should not be visible
        return {
            label: '',
            placeholder: '',
        };
    }

    get hasModeratorActions() {
        return (this.args.registration.reviewsState
        && ![
            RegistrationReviewStates.Initial,
            RegistrationReviewStates.Withdrawn,
            RegistrationReviewStates.Rejected,
        ].includes(this.args.registration.reviewsState))
        || this.revisionIsPending;
    }

    get moderatorActions() {
        const reviewsState =
            this.args.registration.reviewsState as Exclude<RegistrationReviewStates, NonActionableRegistrationStates>;
        const revisionState = this.args.registration.revisionState as ActionableRevisionStates;
        let actions = reviewsState ? reviewsStateToDecisionMap[reviewsState] : [];
        if (this.revisionIsPending) {
            actions = reviewsStateToDecisionMap[revisionState];
        }
        return actions;
    }

    @task
    @waitFor
    async submitDecision() {
        if (this.decisionTrigger) {
            const isSchemaResponseAction = ([
                SchemaResponseActionTrigger.RejectRevision, SchemaResponseActionTrigger.AcceptRevision,
            ] as  Array<SchemaResponseActionTrigger | ReviewActionTrigger>).includes(this.decisionTrigger);
            const actionType = isSchemaResponseAction ? 'schema-response-action' : 'review-action';
            const target = isSchemaResponseAction ? this.args.registration.schemaResponses.lastObject
                : this.args.registration;
            const newAction = this.store.createRecord(actionType, {
                actionTrigger: this.decisionTrigger,
                comment: (this.comment ? this.comment : undefined),
                target,
            });
            try {
                await newAction.save();
                this.toast.success(this.intl.t('registries.makeDecisionDropdown.success'));
                if (this.decisionTrigger === ReviewActionTrigger.RejectSubmission) {
                    this.router.transitionTo(
                        'registries.branded.moderation.submissions',
                        this.args.registration.provider.get('id'),
                        { queryParams: { state: RegistrationReviewStates.Rejected } },
                    );
                } else if (this.decisionTrigger === SchemaResponseActionTrigger.RejectRevision) {
                    this.router.transitionTo(
                        'registries.overview',
                        this.args.registration.get('id'),
                        { queryParams: { mode: 'moderator', revisionId: '' } },
                    );
                }
                this.args.registration.reload();
            } catch (e) {
                const errorMessage = this.intl.t('registries.makeDecisionDropdown.failure');
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
            } finally {
                this.decisionTrigger = undefined;
                this.comment = undefined;
            }
        }
    }

    @action
    updateDecisionTrigger(trigger: ReviewActionTrigger) {
        this.decisionTrigger = trigger;
    }
}
