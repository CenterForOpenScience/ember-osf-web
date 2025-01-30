import { AsyncBelongsTo, belongsTo } from '@ember-data/model';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { ConnectedCitationOperationNames, OperationKwargs } from 'ember-osf-web/models/addon-operation-invocation';


import ExternalCitationServiceModel from './external-citation-service';
import AuthorizedAccountModel from './authorized-account';
import UserReferenceModel from './user-reference';

export default class AuthorizedCitationAccountModel extends AuthorizedAccountModel {
    @belongsTo('user-reference', { inverse: 'authorizedCitationAccounts' })
    accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('external-citation-service')
    externalCitationService!: AsyncBelongsTo<ExternalCitationServiceModel> & ExternalCitationServiceModel;

    @task
    @waitFor
    async getFolderItems(this: AuthorizedAccountModel, kwargs?: OperationKwargs) {
        const operationKwargs = kwargs || {};
        const operationName = operationKwargs.itemId ? ConnectedCitationOperationNames.ListCollectionItems :
            ConnectedCitationOperationNames.ListRootCollections;
        // rename 'itemId' key to 'collectionId'
        delete Object.assign(operationKwargs, { ['collectionId']: operationKwargs['itemId'] })['itemId'];
        const newInvocation = this.store.createRecord('addon-operation-invocation', {
            operationName,
            operationKwargs,
            thruAccount: this,
        });
        return await newInvocation.save();
    }

    @task
    @waitFor
    async getItemInfo(this: AuthorizedAccountModel, _itemId: string) {
        // This is a noop because gravyvalet does not have getItemInfo operation for citation addons
        return;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-citation-account': AuthorizedCitationAccountModel;
    } // eslint-disable-line semi
}
