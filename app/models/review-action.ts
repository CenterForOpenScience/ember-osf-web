import { computed } from '@ember/object';
import DS from 'ember-data';

import OsfModel from './osf-model';
import RegistrationModel from './registration';
import RegistrationProviderModel from './registration-provider';
import UserModel from './user';

const { attr, belongsTo } = DS;

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
    AcceptSubmission = 'accept_submission', // accept submission
    RejectSubmission = 'reject_submission', // reject submission
    ForceWithdraw = 'force_withdraw', // force withdraw without request
    RequestWithdrawal = 'request_withdrawal', // request to withdraw by contributors
    AcceptWithdrawal = 'accept_withdrawal', // accept withdrawal request
    RejectWithdrawal = 'reject_withdrawal', // deny withdrawal request
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
