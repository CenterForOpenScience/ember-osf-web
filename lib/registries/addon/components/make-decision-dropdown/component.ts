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
{ RegistrationReviewStates, reviewsStateToDecisionMap } from 'ember-osf-web/models/registration';
import { ReviewActionTrigger } from 'ember-osf-web/models/review-action';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

interface Args {
    registration: RegistrationModel;
}

export default class MakeDecisionDropdown extends Component<Args> {
    @service intl!: Intl;
    @service store!: Store;
    @service toast!: Toast;
    @service router!: RouterService;

    @tracked decisionTrigger?: ReviewActionTrigger;
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
    };

    actionTriggerToTextMap = {
        [ReviewActionTrigger.ForceWithdraw]: this.intl.t('registries.makeDecisionDropdown.forceWithdraw'),
        [ReviewActionTrigger.AcceptSubmission]: this.intl.t('registries.makeDecisionDropdown.acceptSubmission'),
        [ReviewActionTrigger.RejectSubmission]: this.intl.t('registries.makeDecisionDropdown.rejectSubmission'),
        [ReviewActionTrigger.AcceptWithdrawal]: this.intl.t('registries.makeDecisionDropdown.acceptWithdrawal'),
        [ReviewActionTrigger.RejectWithdrawal]: this.intl.t('registries.makeDecisionDropdown.rejectWithdrawal'),
    };

    get commentTextArea() {
        if ([RegistrationReviewStates.Pending, RegistrationReviewStates.PendingWithdraw]
            .includes(this.args.registration.reviewsState)) {
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

    get hasModeratorActions() {
        return ![
            RegistrationReviewStates.Initial,
            RegistrationReviewStates.Withdrawn,
            RegistrationReviewStates.Rejected,
        ].includes(this.args.registration.reviewsState);
    }

    @task
    @waitFor
    async submitDecision() {
        if (this.decisionTrigger) {
            const newAction = this.store.createRecord('review-action', {
                actionTrigger: this.decisionTrigger,
                comment: (this.comment ? this.comment : undefined),
                target: this.args.registration,
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
