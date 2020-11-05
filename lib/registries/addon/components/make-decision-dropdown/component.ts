import Component from '@glimmer/component';

import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import ReviewActionModel, { ReviewActionTrigger } from 'ember-osf-web/models/review-action';
import Toast from 'ember-toastr/services/toast';

interface Args {
    registration: RegistrationModel;
}

export default class MakeDecisionDropdown extends Component<Args> {
    @service intl!: Intl;
    @service store!: DS.Store;
    @service toast!: Toast;

    @tracked reviewActions: ReviewActionModel[] = [];
    @tracked decisionTrigger?: ReviewActionTrigger;
    @tracked comment?: string;

    machineStateDecisionMap = {
        [RegistrationReviewStates.Accepted]: [ReviewActionTrigger.ForceWithdraw],
        [RegistrationReviewStates.Embargo]: [ReviewActionTrigger.ForceWithdraw],
        [RegistrationReviewStates.Pending]:
            [ReviewActionTrigger.AcceptSubmission, ReviewActionTrigger.RejectSubmission],
        [RegistrationReviewStates.PendingWithdraw]:
            [ReviewActionTrigger.AcceptWithdrawal, ReviewActionTrigger.RejectWithdrawal],
    };

    decisionDescriptionMap = {
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

    @task({ withTestWaiter: true })
    fetchActions = task(function *(this: MakeDecisionDropdown) {
        const reviewActions = yield this.args.registration.reviewActions;
        this.reviewActions = reviewActions.toArray();
    });

    @task({ withTestWaiter: true })
    submitDecision = task(function *(this: MakeDecisionDropdown) {
        if (this.decisionTrigger) {
            const newAction = this.store.createRecord('review-action', {
                actionTrigger: this.decisionTrigger,
                comment: this.comment,
                target: this.args.registration,
            });
            try {
                yield newAction.save();
                this.toast.success(this.intl.t('registries.makeDecisionDropdown.success'));
                this.args.registration.reload();
                this.decisionTrigger = undefined;
                this.comment = undefined;
            } catch {
                this.toast.success(this.intl.t('registries.makeDecisionDropdown.failure'));
            }
        }
    });

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.fetchActions.perform();
        if (this.args.registration.withdrawalJustification) {
            this.comment = this.args.registration.withdrawalJustification;
        }
    }

    @action
    updateDecisionTrigger(trigger: ReviewActionTrigger) {
        this.decisionTrigger = trigger;
    }
}
