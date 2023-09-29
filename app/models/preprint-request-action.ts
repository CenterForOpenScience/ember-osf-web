import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import PreprintRequestModel from 'ember-osf-web/models/preprint-request';
import UserModel from 'ember-osf-web/models/user';

import OsfModel from './osf-model';


export enum PreprintRequestActionTriggerEnum {
    SUBMIT= 'submit',
    ACCEPT = 'accept',
    REJECT = 'reject',
}

export default class PreprintRequestActionModel extends OsfModel {
    @attr('string') comment!: String;
    @attr('string') actionTrigger!: String;
    @attr('date') dateModified!: Date;
    @attr('boolean') auto!: boolean;

    // Relationships
    @belongsTo('preprint-request', { inverse: 'actions' })
    target!: (AsyncBelongsTo<PreprintRequestModel> & PreprintRequestModel);

    @belongsTo('user', { inverse: null, async: true })
    creator!: AsyncBelongsTo<UserModel> & UserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'preprint-request-action': PreprintRequestActionModel;
    } // eslint-disable-line semi
}
