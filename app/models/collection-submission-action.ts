import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import CollectedMetadatumModel, { CollectionSubmissionReviewStates } from './collected-metadatum';
import Action from './action';

export enum CollectionSubmissionActionTrigger {
    Submit = 'submit',
    Resubmit = 'resubmit',
    Accept = 'accept',
    Reject = 'reject',
    ModeratorRemove = 'moderator_remove',
    AdminRemove = 'admin_remove',
}

const TriggerToPastTenseTranslationKey: Record<CollectionSubmissionActionTrigger, string> = {
    submit: 'collections.actions.triggerPastTense.submit',
    resubmit: 'collections.actions.triggerPastTense.resubmit',
    accept: 'collections.actions.triggerPastTense.accept',
    reject: 'collections.actions.triggerPastTense.reject',
    moderator_remove: 'collections.actions.triggerPastTense.moderator_remove',
    admin_remove: 'collections.actions.triggerPastTense.admin_remove',
};

export default class CollectionSubmissionAction extends Action{
    @service intl!: Intl;

    @attr('string') actionTrigger!: CollectionSubmissionActionTrigger;
    @attr('string') fromState!: CollectionSubmissionReviewStates;
    @attr('string') toState!: CollectionSubmissionReviewStates;

    @belongsTo('registration', { inverse: 'reviewActions', polymorphic: true })
    target!: AsyncBelongsTo<CollectedMetadatumModel> & CollectedMetadatumModel;

    @computed('actionTrigger')
    get triggerPastTense(): string {
        const translationKey = TriggerToPastTenseTranslationKey[this.actionTrigger];
        return translationKey ? this.intl.t(translationKey) : '';
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'collection-submission-action': CollectionSubmissionAction;
    }
}
