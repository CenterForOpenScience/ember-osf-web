import { AsyncBelongsTo, belongsTo } from '@ember-data/model';

import ExternalComputingServiceModel from './external-computing-service';
import AuthorizedAccountModel from './authorized-account';
import UserReferenceModel from './user-reference';

export default class AuthorizedComputingAccountModel extends AuthorizedAccountModel {
    @belongsTo('user-reference', { inverse: 'authorizedComputingAccounts' })
    accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('external-computing-service')
    externalComputingService!: AsyncBelongsTo<ExternalComputingServiceModel> & ExternalComputingServiceModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-computing-account': AuthorizedComputingAccountModel;
    } // eslint-disable-line semi
}
