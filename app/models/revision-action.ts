import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import RevisionModel, {RevisionReviewStates} from 'ember-osf-web/models/revision';
import UserModel from 'ember-osf-web/models/user';
import OsfModel from './osf-model';

export enum RevisionActionTrigger {
    SubmitRevision = 'submit_revision',
    AdminApproveRevision = 'admin_approve_revision',
    AdminRejectRevision = 'admin_reject_revision',
    AcceptRevision = 'accept_revision',
    RejectRevision = 'reject_revision',
}

const TriggerToPastTenseTranslationKey: Record<RevisionActionTrigger, string> = {
    submit_revision: 'registries.revisionActions.triggerPastTense.submit_revision',
    admin_approve_revision: 'registries.revisionActions.triggerPastTense.admin_approve_revision',
    admin_reject_revision: 'registries.revisionActions.triggerPastTense.admin_reject_revision',
    accept_revision: 'registries.revisionActions.triggerPastTense.accept_revision',
    reject_revision: 'registries.revisionActions.triggerPastTense.reject_revision',
};

export default class RevisionActionModel extends OsfModel {
    @service intl!: Intl;

    @attr('string') actionTrigger!: RevisionActionTrigger;
    @attr('fixstring') comment!: string;
    @attr('string') fromState!: RevisionReviewStates;
    @attr('string') toState!: RevisionReviewStates;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') visible!: boolean;

    @belongsTo('user', { inverse: null })
    creator!: AsyncBelongsTo<UserModel> & UserModel;

    @belongsTo('revision', { inverse: 'actions' })
    target!: AsyncBelongsTo<RevisionModel> & RevisionModel;

    @computed('actionTrigger')
    get triggerPastTense(): string {
        const key = TriggerToPastTenseTranslationKey[this.actionTrigger] || '';
        return key ? this.intl.t(key) : '';
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'revision-action': RevisionActionModel;
    } // eslint-disable-line semi
}
