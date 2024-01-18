import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import InternalResourceModel from './internal-resource';
import InternalUserModel from './internal-user';
import OsfModel from './osf-model';
import ExternalStorageServiceModel from './external-storage-service';

export default class ConfiguredStorageAddonModel extends OsfModel {
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstring') rootFolder!: string;

    @belongsTo('external-storage-service', { inverse: null })
    storageProvider!: AsyncBelongsTo<ExternalStorageServiceModel> & ExternalStorageServiceModel;

    @belongsTo('internal-user')
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
