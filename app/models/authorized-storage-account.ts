import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { ConnectedStorageOperationNames, OperationKwargs } from 'ember-osf-web/models/addon-operation-invocation';
import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';

import AuthorizedAccountModel from './authorized-account';
import UserReferenceModel from './user-reference';

export default class AuthorizedStorageAccountModel extends AuthorizedAccountModel {
    @attr('fixstring') serializeOauthToken!: string;
    @attr('fixstring') oauthToken!: string;

    @belongsTo('user-reference', { inverse: 'authorizedStorageAccounts' })
    readonly accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('external-storage-service')
    externalStorageService!: AsyncBelongsTo<ExternalStorageServiceModel> & ExternalStorageServiceModel;

    @task
    @waitFor
    async getFolderItems(this: AuthorizedAccountModel, kwargs?: OperationKwargs) {
        const operationKwargs = kwargs || {};
        const operationName = operationKwargs.itemId ? ConnectedStorageOperationNames.ListChildItems :
            ConnectedStorageOperationNames.ListRootItems;
        const newInvocation = this.store.createRecord('addon-operation-invocation', {
            operationName,
            operationKwargs,
            thruAccount: this,
        });
        return await newInvocation.save();
    }

    @task
    @waitFor
    async getItemInfo(this: AuthorizedAccountModel, itemId: string) {
        const newInvocation = this.store.createRecord('addon-operation-invocation', {
            operationName: ConnectedStorageOperationNames.GetItemInfo,
            operationKwargs: { itemId },
            thruAccount: this,
        });
        return await newInvocation.save();
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-storage-account': AuthorizedStorageAccountModel;
    } // eslint-disable-line semi
}
