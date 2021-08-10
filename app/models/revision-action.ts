import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import RevisionModel from 'ember-osf-web/models/revision';
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
    submit_revision: 'submit',
    admin_approve_revision: 'approve',
    admin_reject_revision: 'reject',
    accept_revision: 'accept',
    reject_revision: 'reject',
};

export default class RevisionActionModel extends OsfModel {
    @attr('string') actionTrigger!: RevisionActionTrigger;
    @attr('fixstring') comment!: string;
    @attr('string') fromState!: string;
    @attr('string') toState!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') visible!: boolean;

    @belongsTo('user', { inverse: null })
    creator!: AsyncBelongsTo<UserModel> & UserModel;

    @belongsTo('revision', { inverse: 'actions' })
    target!: AsyncBelongsTo<RevisionModel> & RevisionModel;

    @computed('actionTrigger')
    get pastTenseActionTrigger(): string {
        return TriggerToPastTenseTranslationKey[this.actionTrigger] || '';
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'revision-action': RevisionActionModel;
    } // eslint-disable-line semi
}
