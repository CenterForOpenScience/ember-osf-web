import { computed } from '@ember/object';
import DS from 'ember-data';

import OsfModel from './osf-model';
import RegistrationModel from './registration';
import RegistrationProviderModel from './registration-provider';
import UserModel from './user';

const { attr, belongsTo } = DS;

export enum ReviewActionTrigger {
    Accept = 'accept', // accept submission
    Reject = 'reject', // reject submission
    Embargo = 'embargo', // embargo (accept) submission
    ForceWithdraw = 'force_withdraw', // force withdraw without request
    RequestWithdraw = 'request_withdraw', // request to withdraw by contributors
    WithdrawRequestPasses = 'withdraw_request_passes', // other contributors approves requests
    WithdrawRequestFails = 'withdraw_request_fails', // other contributors disapprove of requests
    Withdraw = 'withdraw', // accept withdrawal request
    RejectWithdraw = 'reject_withdraw', // deny withdrawal request
    RequestEmbargoTermination = 'request_embargo_termination', // request to end embargo early
    TerminateEmbargo = 'terminate_embargo', // contributors approve request to end embargo early
}

// make sure these match the reviewActionTriggers
const TriggersPastTenseMap: Record<string, string> = {
    submit: 'Submitted',
    accept: 'Accepted',
    reject: 'Rejected',
    edit_comment: 'Comment edited',
    embargo: 'Embargoed',
    withdraw: 'Withdrawn',
    request_withdraw: 'Withdrawal requested',
    withdraw_request_passes: 'Withdrawal request accepted',
    withdraw_request_fails: 'Withdrawal rejected',
    force_withdraw: 'Withdrawal forced',
    request_embargo: 'Embargo requested',
    request_embargo_termination: 'Embargo termination requested',
    terminate_embargo: 'Embargo terminated',
};

export enum ReviewActionTrigger {
    Accept = 'accept', // accept submission
    Reject = 'reject', // reject submission
    Embargo = 'embargo', // embargo (accept) submission
    ForceWithdraw = 'force_withdraw', // force withdraw without request
    RequestWithdraw = 'request_withdraw', // request to withdraw by contributors
    WithdrawRequestPasses = 'withdraw_request_passes', // other contributors approves requests
    WithdrawRequestFails = 'withdraw_request_fails', // other contributors disapprove of requests
    Withdraw = 'withdraw', // accept withdrawal request
    RejectWithdraw = 'reject_withdraw', // deny withdrawal request
    RequestEmbargoTermination = 'request_embargo_termination', // request to end embargo early
    TerminateEmbargo = 'terminate_embargo', // contributors approve request to end embargo early
}

export default class ReviewActionModel extends OsfModel {
    @attr('string') actionTrigger!: ReviewActionTrigger;
    @attr('string') comment!: string;
    @attr('string') fromState!: string;
    @attr('string') toState!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') auto!: boolean;
    @attr('boolean') visible!: boolean;

    @belongsTo('registration-provider', { inverse: 'actions', polymorphic: true })
    provider!: DS.PromiseObject<RegistrationProviderModel> & RegistrationProviderModel;

    @belongsTo('registration', { inverse: 'reviewActions', polymorphic: true })
    target!: DS.PromiseObject<RegistrationModel> & RegistrationModel;

    @belongsTo('user', { inverse: null })
    creator!: DS.PromiseObject<UserModel> & UserModel;

    @computed('actionTrigger')
    get triggerPastTense(): string {
        return TriggersPastTenseMap[this.actionTrigger];
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'review-action': ReviewActionModel;
    } // eslint-disable-line semi
}
