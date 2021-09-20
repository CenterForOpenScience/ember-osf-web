import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import SchemaResponseModel, { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import UserModel from 'ember-osf-web/models/user';
import OsfModel from './osf-model';

export enum SchemaResponseActionTrigger {
    SubmitRevision = 'submit_revision',
    AdminApproveRevision = 'admin_approve_revision',
    AdminRejectRevision = 'admin_reject_revision',
    AcceptRevision = 'accept_revision',
    RejectRevision = 'reject_revision',
}

const TriggerToPastTenseTranslationKey: Record<SchemaResponseActionTrigger, string> = {
    submit_revision: 'registries.schemaResponseActions.triggerPastTense.submit_revision',
    admin_approve_revision: 'registries.schemaResponseActions.triggerPastTense.admin_approve_revision',
    admin_reject_revision: 'registries.schemaResponseActions.triggerPastTense.admin_reject_revision',
    accept_revision: 'registries.schemaResponseActions.triggerPastTense.accept_revision',
    reject_revision: 'registries.schemaResponseActions.triggerPastTense.reject_revision',
};

export default class SchemaResponseActionModel extends OsfModel {
    @service intl!: Intl;

    @attr('string') actionTrigger!: SchemaResponseActionTrigger;
    @attr('fixstring') comment!: string;
    @attr('string') fromState!: RevisionReviewStates;
    @attr('string') toState!: RevisionReviewStates;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') visible!: boolean;

    @belongsTo('user', { inverse: null })
    creator!: AsyncBelongsTo<UserModel> & UserModel;

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
