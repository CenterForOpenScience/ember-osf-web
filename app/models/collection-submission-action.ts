import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import CollectionSubmissionModel, { CollectionSubmissionReviewStates } from './collection-submission';
import Action from './action';

export enum CollectionSubmissionActionTrigger {
    Submit = 'submit',
    Resubmit = 'resubmit',
    Accept = 'accept',
    Reject = 'reject',
    Remove = 'remove',
}

const TriggerToPastTenseTranslationKey: Record<CollectionSubmissionActionTrigger, string> = {
    submit: 'collections.actions.triggerPastTense.submit',
    resubmit: 'collections.actions.triggerPastTense.resubmit',
    accept: 'collections.actions.triggerPastTense.accept',
    reject: 'collections.actions.triggerPastTense.reject',
    remove: 'collections.actions.triggerPastTense.remove',
};

type ModeratorActionTriggers =
    CollectionSubmissionActionTrigger.Accept |
    CollectionSubmissionActionTrigger.Reject |
    CollectionSubmissionActionTrigger.Remove;

export const CollectionSubmissionActionTriggerToLabelMapKey: Record<ModeratorActionTriggers, string> = {
    [CollectionSubmissionActionTrigger.Accept]: 'osf-components.makeDecisionDropdown.acceptCollectionSubmission',
    [CollectionSubmissionActionTrigger.Reject]: 'osf-components.makeDecisionDropdown.rejectCollectionSubmission',
    [CollectionSubmissionActionTrigger.Remove]:
        'osf-components.makeDecisionDropdown.removeCollectionSubmission',
};
export const CollectionSubmissionActionTriggerToDescriptionKey: Record<ModeratorActionTriggers, string> = {
    [CollectionSubmissionActionTrigger.Accept]:
        'osf-components.makeDecisionDropdown.acceptCollectionSubmissionDescription',
    [CollectionSubmissionActionTrigger.Reject]:
        'osf-components.makeDecisionDropdown.rejectCollectionSubmissionDescription',
    [CollectionSubmissionActionTrigger.Remove]:
        'osf-components.makeDecisionDropdown.removeCollectionSubmissionDescription',
};

export default class CollectionSubmissionAction extends Action{
    @service intl!: Intl;

    @attr('string') actionTrigger!: CollectionSubmissionActionTrigger;
    @attr('string') fromState!: CollectionSubmissionReviewStates;
    @attr('string') toState!: CollectionSubmissionReviewStates;

    @belongsTo('collection-submission', { inverse: 'collectionSubmissionActions' })
    target!: AsyncBelongsTo<CollectionSubmissionModel> & CollectionSubmissionModel;

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
