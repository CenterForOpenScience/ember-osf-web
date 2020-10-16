import { computed } from '@ember/object';
import DS from 'ember-data';

import OsfModel from './osf-model';
import RegistrationModel from './registration';
import RegistrationProviderModel from './registration-provider';
import UserModel from './user';

const { attr, belongsTo } = DS;

const TriggersPastTenseMap: Record<string, string> = {
    submit: 'Submitted',
    accept: 'Accepted',
    reject: 'Rejected',
    edit_comment: 'Edited comment',
    embargo: 'Embargoed',
    withdraw: 'Withdrawn',
    request_withdraw: 'Withdrawal requested',
    reject_withdraw: 'Withdrawal rejected',
    force_withdraw: 'Withdrawal forced',
    request_embargo: 'Embargo requested',
    request_embargo_termination: 'Embargo termination requested',
    terminate_embargo: 'Embargo terminated',
};

export default class ReviewActionModel extends OsfModel {
    @attr('string') actionTrigger!: string;
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
