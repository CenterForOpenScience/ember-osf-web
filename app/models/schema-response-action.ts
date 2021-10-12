import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import SchemaResponseModel, { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import UserModel from 'ember-osf-web/models/user';
import OsfModel from './osf-model';

export enum SchemaResponseActionTrigger {
    SubmitRevision = 'submit',
    AdminApproveRevision = 'admin_approve',
    AdminRejectRevision = 'admin_reject',
    AcceptRevision = 'accept',
    RejectRevision = 'moderator_reject',
}

const TriggerToPastTenseTranslationKey: Record<SchemaResponseActionTrigger, string> = {
    submit: 'registries.schemaResponseActions.triggerPastTense.submit',
    admin_approve: 'registries.schemaResponseActions.triggerPastTense.admin_approve',
    admin_reject: 'registries.schemaResponseActions.triggerPastTense.admin_reject',
    accept: 'registries.schemaResponseActions.triggerPastTense.accept',
    moderator_reject: 'registries.schemaResponseActions.triggerPastTense.moderator_reject',
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
