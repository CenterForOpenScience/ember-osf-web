import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import Action from './action';
import SchemaResponseModel, { RevisionReviewStates } from './schema-response';

export enum SchemaResponseActionTrigger {
    SubmitRevision = 'submit',
    AdminApproveRevision = 'approve',
    AdminRejectRevision = 'admin_reject',
    AcceptRevision = 'accept',
    RejectRevision = 'moderator_reject',
}

const TriggerToPastTenseTranslationKey: Record<SchemaResponseActionTrigger, string> = {
    submit: 'registries.schemaResponseActions.triggerPastTense.submit',
    approve: 'registries.schemaResponseActions.triggerPastTense.approve',
    admin_reject: 'registries.schemaResponseActions.triggerPastTense.admin_reject',
    accept: 'registries.schemaResponseActions.triggerPastTense.accept',
    moderator_reject: 'registries.schemaResponseActions.triggerPastTense.moderator_reject',
};

export type SchemaResponseModeratorActionTriggers =
    SchemaResponseActionTrigger.AcceptRevision |
    SchemaResponseActionTrigger.RejectRevision;

export const SchemaResponseActionTriggerToLabelMapKey: Record<SchemaResponseModeratorActionTriggers, string> = {
    [SchemaResponseActionTrigger.AcceptRevision]: 'osf-components.makeDecisionDropdown.acceptRevision',
    [SchemaResponseActionTrigger.RejectRevision]: 'osf-components.makeDecisionDropdown.rejectRevision',
};
export const SchemaResponseActionTriggerToDescriptionKey: Record<SchemaResponseModeratorActionTriggers, string> = {
    [SchemaResponseActionTrigger.AcceptRevision]:
        'osf-components.makeDecisionDropdown.acceptRevisionDescription',
    [SchemaResponseActionTrigger.RejectRevision]:
        'osf-components.makeDecisionDropdown.rejectRevisionDescription',
};

export default class SchemaResponseActionModel extends Action {
    @service intl!: Intl;

    @attr('string') actionTrigger!: SchemaResponseActionTrigger;
    @attr('string') fromState!: RevisionReviewStates;
    @attr('string') toState!: RevisionReviewStates;

    @belongsTo('schema-response', { inverse: 'actions' })
    target!: AsyncBelongsTo<SchemaResponseModel> & SchemaResponseModel;

    @computed('actionTrigger')
    get triggerPastTense(): string {
        const key = TriggerToPastTenseTranslationKey[this.actionTrigger] || '';
        return key ? this.intl.t(key) : '';
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'schema-response-action': SchemaResponseActionModel;
    } // eslint-disable-line semi
}
