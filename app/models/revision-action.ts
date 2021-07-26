import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import RevisionModel from 'ember-osf-web/models/revision';
import UserModel from 'ember-osf-web/models/user';
import OsfModel from './osf-model';

export enum ReviewActionTrigger {
    SubmitRevision = 'submit_revision',
    AdminApproveRevision = 'admin_approve_revision',
    AdminRejectRevision = 'admin_reject_revision',
    AcceptRevision = 'accept_revision',
    RejectRevision = 'reject_revision',
}

export default class RevisionActionModel extends OsfModel {
    @attr('string') actionTrigger!: ReviewActionTrigger;
    @attr('fixstring') comment!: string;
    @attr('string') fromState!: string;
    @attr('string') toState!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') visible!: boolean;

    @belongsTo('user', { inverse: null })
    creator!: AsyncBelongsTo<UserModel> & UserModel;

    @belongsTo('revision', { inverse: null })
    target!: AsyncBelongsTo<RevisionModel> & RevisionModel;

}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'revision-action': RevisionActionModel;
    } // eslint-disable-line semi
}
