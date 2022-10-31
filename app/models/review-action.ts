import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import Action from './action';
import RegistrationModel, { RegistrationReviewStates } from './registration';

export enum ReviewActionTrigger {
    Submit = 'submit', // registration submitted by admins
    AcceptSubmission = 'accept_submission', // accept submission
    RejectSubmission = 'reject_submission', // reject submission
    ForceWithdraw = 'force_withdraw', // force withdraw without request
    RequestWithdrawal = 'request_withdrawal', // request to withdraw by contributors
    AcceptWithdrawal = 'accept_withdrawal', // accept withdrawal request
    RejectWithdrawal = 'reject_withdrawal', // deny withdrawal request
    RequestEmbargoTermination = 'request_embargo_termination', // admin requests embargo termination
}

const TriggerToPastTenseTranslationKey: Record<ReviewActionTrigger, string> = {
    submit: 'registries.reviewActions.triggerPastTense.submit',
    accept_submission: 'registries.reviewActions.triggerPastTense.accept_submission',
    reject_submission: 'registries.reviewActions.triggerPastTense.reject_submission',
    force_withdraw: 'registries.reviewActions.triggerPastTense.force_withdraw',
    request_withdrawal: 'registries.reviewActions.triggerPastTense.request_withdrawal',
    accept_withdrawal: 'registries.reviewActions.triggerPastTense.accept_withdrawal',
    reject_withdrawal: 'registries.reviewActions.triggerPastTense.reject_withdrawal',
    request_embargo_termination: 'registries.reviewActions.triggerPastTense.request_embargo_termination',
};

export type ReviewActionModeratorActionTriggers =
    ReviewActionTrigger.ForceWithdraw |
    ReviewActionTrigger.AcceptSubmission |
    ReviewActionTrigger.RejectSubmission |
    ReviewActionTrigger.AcceptWithdrawal |
    ReviewActionTrigger.RejectWithdrawal;

export const ReviewActionTriggerToTextLabelKey: Record<ReviewActionModeratorActionTriggers, string> = {
    [ReviewActionTrigger.ForceWithdraw]: 'osf-components.makeDecisionDropdown.forceWithdraw',
    [ReviewActionTrigger.AcceptSubmission]: 'osf-components.makeDecisionDropdown.acceptSubmission',
    [ReviewActionTrigger.RejectSubmission]: 'osf-components.makeDecisionDropdown.rejectSubmission',
    [ReviewActionTrigger.AcceptWithdrawal]: 'osf-components.makeDecisionDropdown.acceptWithdrawal',
    [ReviewActionTrigger.RejectWithdrawal]: 'osf-components.makeDecisionDropdown.rejectWithdrawal',
};
export const ReviewActionTriggerToDescriptionKey: Record<ReviewActionModeratorActionTriggers, string> = {
    [ReviewActionTrigger.ForceWithdraw]:
        'osf-components.makeDecisionDropdown.forceWithdrawDescription',
    [ReviewActionTrigger.AcceptSubmission]:
        'osf-components.makeDecisionDropdown.acceptSubmissionDescription',
    [ReviewActionTrigger.RejectSubmission]:
        'osf-components.makeDecisionDropdown.rejectSubmissionDescription',
    [ReviewActionTrigger.AcceptWithdrawal]:
        'osf-components.makeDecisionDropdown.acceptWithdrawalDescription',
    [ReviewActionTrigger.RejectWithdrawal]:
        'osf-components.makeDecisionDropdown.rejectWithdrawalDescription',
};

export default class ReviewActionModel extends Action {
    @service intl!: Intl;

    @attr('string') actionTrigger!: ReviewActionTrigger;
    @attr('string') fromState!: RegistrationReviewStates;
    @attr('string') toState!: RegistrationReviewStates;

    @belongsTo('registration', { inverse: 'reviewActions', polymorphic: true })
    target!: AsyncBelongsTo<RegistrationModel> & RegistrationModel;

    @computed('actionTrigger')
    get triggerPastTense(): string {
        const translationKey = TriggerToPastTenseTranslationKey[this.actionTrigger];
        return translationKey ? this.intl.t(translationKey) : '';
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'review-action': ReviewActionModel;
    } // eslint-disable-line semi
}
