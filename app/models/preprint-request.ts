import { AsyncBelongsTo, SyncHasMany, attr, belongsTo, hasMany } from '@ember-data/model';
import PreprintModel from 'ember-osf-web/models/preprint';
import UserModel from 'ember-osf-web/models/user';
import PreprintRequestActionModel from 'ember-osf-web/models/preprint-request-action';

import OsfModel from './osf-model';

export enum PreprintRequestType{
    WITHDRAWAL = 'withdrawal',
}

export enum PreprintRequestMachineState {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

export default class PreprintRequestModel extends OsfModel {
    @attr('string') comment!: string;
    @attr('date') dateLastTransitioned!: Date;
    @attr('date') created!: Date;
    @attr('date') modified!: Date;
    @attr('string') machineState!: string;
    @attr('string') requestType!: string;

    @belongsTo('preprint', { inverse: 'requests'})
    target!: (AsyncBelongsTo<PreprintModel> & PreprintModel);

    @belongsTo('user', { inverse: null, async: true })
    creator!: AsyncBelongsTo<UserModel> & UserModel;

    @hasMany('preprint-request-action', { inverse: 'target'})
    actions!: SyncHasMany<PreprintRequestActionModel> & PreprintRequestActionModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'preprint-request': PreprintRequestModel;
    } // eslint-disable-line semi
}
