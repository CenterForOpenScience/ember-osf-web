import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import ResourceReferenceModel from './resource-reference';
import UserReferenceModel from './user-reference';
import OsfModel from './osf-model';
import ExternalStorageServiceModel from './external-storage-service';

export enum ConnectedCapabilities {
    Access = 'ACCESS',
    Update = 'UPDATE',
}

export enum ConnectedOparationNames {
    DownloadAsZip = 'download_as_zip',
    CopyInto = 'copy_into',
    HasRevisions = 'has_revisions',
}

export default class ConfiguredStorageAddonModel extends OsfModel {
    @attr('string') name!: string;
    @attr('string') displayName!: string;
    @attr('array') connectedCapabilities!: ConnectedCapabilities[];
    @attr('array') connectedOperationNames!: ConnectedOparationNames[];
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('number') concurrentUploads!: number;
    @attr('fixstring') rootFolder!: string;
    @attr('string') iconUrl!: string;

    @belongsTo('external-storage-service', { inverse: null })
    storageProvider!: AsyncBelongsTo<ExternalStorageServiceModel> & ExternalStorageServiceModel;

    @belongsTo('user-reference', { inverse: null })
    accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @belongsTo('resource-reference', { inverse: 'configuredStorageAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    @belongsTo('authorized-storage-account')
    baseAccount!: AsyncBelongsTo<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-storage-addon': ConfiguredStorageAddonModel;
    } // eslint-disable-line semi
}
