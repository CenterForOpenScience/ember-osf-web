import { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { ConnectedLinkOperationNames, OperationKwargs } from 'ember-osf-web/models/addon-operation-invocation';

import ExternalLinkServiceModel from 'ember-osf-web/models/external-link-service';
import AuthorizedAccountModel from './authorized-account';
import UserReferenceModel from './user-reference';

export default class AuthorizedLinkAccountModel extends AuthorizedAccountModel {
    @belongsTo('user-reference', { inverse: 'authorizedLinkAccounts' })
    readonly accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('external-link-service')
    externalLinkService!: AsyncBelongsTo<ExternalLinkServiceModel> & ExternalLinkServiceModel;

    @task
    @waitFor
    async getFolderItems(this: AuthorizedAccountModel, kwargs?: OperationKwargs) {
        const operationKwargs = kwargs || {};
        const operationName = operationKwargs.itemId ? ConnectedLinkOperationNames.ListChildItems :
            ConnectedLinkOperationNames.ListRootItems;
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
            operationName: ConnectedLinkOperationNames.GetItemInfo,
            operationKwargs: { itemId },
            thruAccount: this,
        });
        return await newInvocation.save();
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-link-account': AuthorizedLinkAccountModel;
    } // eslint-disable-line semi
}
