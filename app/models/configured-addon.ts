import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';

import UserReferenceModel from 'ember-osf-web/models/user-reference';
import { tracked } from 'tracked-built-ins';
import { taskFor } from 'ember-concurrency-ts';
import { ConnectedStorageOperationNames, OperationKwargs } from './addon-operation-invocation';


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
    @attr('array') connectedOperationNames!: ConnectedStorageOperationNames[];
    @attr('fixstring') rootFolder!: string;

    @belongsTo('user-reference', { inverse: null })
    accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @attr('boolean')
    currentUserIsOwner!: boolean;

    async getFolderItems(this: ConfiguredAddonModel, _kwargs?: OperationKwargs) : Promise<any> {
        // To be implemented in child classes
        return;
    }


    async getItemInfo(this: ConfiguredAddonModel, _itemId: string) : Promise<any> {
        // To be implemented in child classes
        return;
    }

    get hasRootFolder() {
        return true;

    }

    @tracked rootFolderName = '';

    @task
    @waitFor
    async getRootFolderName(this: ConfiguredAddonModel) {
        const response = await taskFor(this.getItemInfo).perform(this.rootFolder);
        this.rootFolderName = response.operationResult.itemName;
    }
}
