import { AsyncBelongsTo, belongsTo } from '@ember-data/model';

import ExternalComputingService from './external-computing-service';
import AuthorizedAccountModel from './authorized-account';
import UserReferenceModel from './user-reference';

export default class AuthorizedComputingAccount extends AuthorizedAccountModel {
    @belongsTo('user-reference', { inverse: 'authorizedComputingAccounts' })
    configuringUser!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('external-computing-service')
    computingService!: AsyncBelongsTo<ExternalComputingService> & ExternalComputingService;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-computing-account': AuthorizedComputingAccount;
    } // eslint-disable-line semi
}
