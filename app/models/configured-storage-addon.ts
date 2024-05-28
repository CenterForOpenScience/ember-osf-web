import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import ConfiguredAddonModel from './configured-addon';
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
    GetRootItems = 'get_root_items',
    GetChildItems = 'get_child_items',
}

export default class ConfiguredStorageAddonModel extends ConfiguredAddonModel {
    // Move these to superclass?
    @attr('array') connectedCapabilities!: ConnectedCapabilities[];
    @attr('array') connectedOperationNames!: ConnectedOperationNames[];

    @attr('number') concurrentUploads!: number;
    @attr('fixstring') rootFolder!: string;

    @belongsTo('external-storage-service', { inverse: null })
    storageProvider!: AsyncBelongsTo<ExternalStorageServiceModel> & ExternalStorageServiceModel;

    @belongsTo('authorized-storage-account')
    baseAccount!: AsyncBelongsTo<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel;

    @task
    @waitFor
    async getFolderItems(this: ConfiguredStorageAddonModel, folderId?: string) {
        const newInvocation = this.store.createRecord('addon-operation-invocation', {

            operationName: folderId ? ConnectedOperationNames.GetChildItems : ConnectedOperationNames.GetRootItems,
            operationKwargs: {
                folderId,
                type: ItemType.Folder,
            },
            thruAddon: this,
            byUser: await this.accountOwner,
        });
        return await newInvocation.save();
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-storage-addon': ConfiguredStorageAddonModel;
    } // eslint-disable-line semi
}
