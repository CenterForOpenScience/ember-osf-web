import { AsyncBelongsTo, belongsTo } from '@ember-data/model';

import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import {
    ConnectedCitationOperationNames, Item, OperationKwargs,
} from 'ember-osf-web/models/addon-operation-invocation';
import { taskFor } from 'ember-concurrency-ts';
import AuthorizedCitationAccountModel from './authorized-citation-account';
import ExternalCitationServiceModel from './external-citation-service';
import ConfiguredAddonModel from './configured-addon';

export default class ConfiguredCitationAddonModel extends ConfiguredAddonModel {
    @belongsTo('external-citation-service', { inverse: null })
    externalCitationService!: AsyncBelongsTo<ExternalCitationServiceModel> & ExternalCitationServiceModel;

    @belongsTo('authorized-citation-account')
    baseAccount!: AsyncBelongsTo<AuthorizedCitationAccountModel> & AuthorizedCitationAccountModel;

    @belongsTo('resource-reference', { inverse: 'configuredCitationAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    get externalServiceId() {
        return (this as ConfiguredCitationAddonModel).belongsTo('externalCitationService').id();
    }

    @task
    @waitFor
    async getFolderItems(this: ConfiguredAddonModel, kwargs?: OperationKwargs) {
        const operationKwargs = kwargs || {};
        const operationName = operationKwargs.itemId ? ConnectedCitationOperationNames.ListCollectionItems :
            ConnectedCitationOperationNames.ListRootCollections;
        // rename 'itemId' key to 'collectionId'
        delete Object.assign(operationKwargs, { ['collectionId']: operationKwargs['itemId'] })['itemId'];
        const newInvocation = this.store.createRecord('addon-operation-invocation', {
            operationName,
            operationKwargs,
            thruAddon: this,
        });
        return await newInvocation.save();
    }

    @task
    @waitFor
    async getItemInfo(this: ConfiguredAddonModel, itemId: string) {
        const newInvocation = this.store.createRecord('addon-operation-invocation', {
            operationName: ConnectedCitationOperationNames.GetItemInfo,
            operationKwargs: { itemId },
            thruAddon: this,
        });
        return await newInvocation.save();
    }

    @task
    @waitFor
    async getSelectedItemName(this: ConfiguredCitationAddonModel) {
        const response = await taskFor(this.getItemInfo).perform(this.rootFolder);
        this.rootFolderName = (response.operationResult as Item).itemName;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-citation-addon': ConfiguredCitationAddonModel;
    } // eslint-disable-line semi
}
