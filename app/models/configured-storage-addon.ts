import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import ConfiguredAddonModel from './configured-addon';
import ExternalStorageServiceModel from './external-storage-service';

export enum ConnectedCapabilities {
    Access = 'ACCESS',
    Update = 'UPDATE',
}

export enum ConnectedOperationNames {
    DownloadAsZip = 'download_as_zip',
    CopyInto = 'copy_into',
    HasRevisions = 'has_revisions',
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
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-storage-addon': ConfiguredStorageAddonModel;
    } // eslint-disable-line semi
}
