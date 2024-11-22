import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';

import { ConnectedOperationNames, OperationKwargs } from './addon-operation-invocation';
import ResourceReferenceModel from './resource-reference';
import UserReferenceModel from './user-reference';
import { ConnectedCapabilities } from './authorized-account';

export interface ConfiguredAddonEditableAttrs {
    displayName: string;
    rootFolder: string;
}

export default class ConfiguredAddonModel extends Model {
    @attr('string') displayName!: string;
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;

    @attr('string') iconUrl!: string;
    @attr('string') authorizedResourceUri?: string;

    @attr('array') connectedCapabilities!: ConnectedCapabilities[];
    @attr('array') connectedOperationNames!: ConnectedOperationNames[];
    @attr('fixstring') rootFolder!: string;


    @belongsTo('user-reference', { inverse: null })
    accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('resource-reference', { inverse: 'configuredStorageAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    @task
    @waitFor
    async getFolderItems(this: ConfiguredAddonModel, kwargs?: OperationKwargs) {
        const operationKwargs = kwargs || {};
        const operationName = operationKwargs.itemId ? ConnectedOperationNames.ListChildItems :
            ConnectedOperationNames.ListRootItems;
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
            operationName: ConnectedOperationNames.GetItemInfo,
            operationKwargs: { itemId },
            thruAddon: this,
        });
        return await newInvocation.save();
    }
}
