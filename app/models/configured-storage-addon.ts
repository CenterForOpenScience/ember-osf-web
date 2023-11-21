import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import InternalResourceModel from './internal-resource';
import InternalUserModel from './internal-user';
import OsfModel from './osf-model';
import StorageAddonProviderModel from './storage-addon-provider';

export default class ConfiguredStorageAddonModel extends OsfModel {
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstring') rootFolder!: string;

    @belongsTo('storage-addon-provider')
    storageProvider!: AsyncBelongsTo<StorageAddonProviderModel> & StorageAddonProviderModel;

    @belongsTo('internal-user', { inverse: 'configuredResources' })
    accountOwner!: AsyncBelongsTo<InternalUserModel> & InternalUserModel;

    @belongsTo('internal-resource', { inverse: 'configuredStorageAddons' })
    authorizedResource!: AsyncBelongsTo<InternalResourceModel> & InternalResourceModel;

    @belongsTo('authorized-storage-account')
    baseAccount!: AsyncBelongsTo<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-storage-addon': ConfiguredStorageAddonModel;
    } // eslint-disable-line semi
}
