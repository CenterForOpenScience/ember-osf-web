import { AsyncBelongsTo, belongsTo } from '@ember-data/model';

import ExternalStorageServiceModel from './external-storage-service';
import AuthorizedAccountModel from './authorized-account';
import UserReferenceModel from './user-reference';

export default class AuthorizedStorageAccountModel extends AuthorizedAccountModel {
    @belongsTo('user-reference', { inverse: 'authorizedStorageAccounts' })
    readonly accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('external-storage-service')
    externalStorageService!: AsyncBelongsTo<ExternalStorageServiceModel> & ExternalStorageServiceModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-storage-account': AuthorizedStorageAccountModel;
    } // eslint-disable-line semi
}
