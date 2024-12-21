import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { ConnectedStorageOperationNames, OperationKwargs } from 'ember-osf-web/models/addon-operation-invocation';
import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import ConfiguredAddonModel from './configured-addon';
import ExternalStorageServiceModel from './external-storage-service';


export default class ConfiguredStorageAddonModel extends ConfiguredAddonModel {
    @attr('number') concurrentUploads!: number;

    @belongsTo('external-storage-service', { inverse: null })
    externalStorageService!: AsyncBelongsTo<ExternalStorageServiceModel> & ExternalStorageServiceModel;

    @belongsTo('authorized-storage-account')
    baseAccount!: AsyncBelongsTo<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel;

    @belongsTo('resource-reference', { inverse: 'configuredStorageAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    get externalServiceId() {
        return (this as ConfiguredStorageAddonModel).belongsTo('externalStorageService').id();
    }

    @task
    @waitFor
    async getFolderItems(this: ConfiguredAddonModel, kwargs?: OperationKwargs) {
        const operationKwargs = kwargs || {};
        const operationName = operationKwargs.itemId ? ConnectedStorageOperationNames.ListChildItems :
            ConnectedStorageOperationNames.ListRootItems;
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
            operationName: ConnectedStorageOperationNames.GetItemInfo,
            operationKwargs: { itemId },
            thruAddon: this,
        });
        return await newInvocation.save();
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-storage-addon': ConfiguredStorageAddonModel;
    } // eslint-disable-line semi
}
