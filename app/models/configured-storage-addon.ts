import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import ConfiguredAddonModel, { ConfiguredAddonEditableAttrs } from './configured-addon';
import ExternalStorageServiceModel from './external-storage-service';
import { ItemType } from './addon-operation-invocation';

export enum ConnectedCapabilities {
    Access = 'ACCESS',
    Update = 'UPDATE',
}

export enum ConnectedOperationNames {
    DownloadAsZip = 'download_as_zip',
    CopyInto = 'copy_into',
    HasRevisions = 'has_revisions',
    ListRootItems = 'list_root_items',
    ListChildItems = 'list_child_items',
    GetItemInfo = 'get_item_info',
}

export interface OperationKwargs {
    itemId?: string;
    itemType?: ItemType;
    pageCursor?: string;
}

export interface ConfiguredStorageAddonEditableAttrs extends ConfiguredAddonEditableAttrs {
    rootFolder: string;
}

export default class ConfiguredStorageAddonModel extends ConfiguredAddonModel {
    // Move these to superclass?
    @attr('array') connectedCapabilities!: ConnectedCapabilities[];
    @attr('array') connectedOperationNames!: ConnectedOperationNames[];

    @attr('number') concurrentUploads!: number;
    @attr('fixstring') rootFolder!: string;

    @belongsTo('external-storage-service', { inverse: null })
    externalStorageService!: AsyncBelongsTo<ExternalStorageServiceModel> & ExternalStorageServiceModel;

    @belongsTo('authorized-storage-account')
    baseAccount!: AsyncBelongsTo<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel;

    @task
    @waitFor
    async getFolderItems(this: ConfiguredStorageAddonModel, kwargs?: OperationKwargs) {
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
    async getItemInfo(this: ConfiguredStorageAddonModel, itemId: string) {
        const newInvocation = this.store.createRecord('addon-operation-invocation', {
            operationName: ConnectedOperationNames.GetItemInfo,
            operationKwargs: { itemId },
            thruAddon: this,
        });
        return await newInvocation.save();
    }

    get externalServiceId() {
        return this.get('baseAccount').get('externalStorageService').get('id');
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-storage-addon': ConfiguredStorageAddonModel;
    } // eslint-disable-line semi
}
