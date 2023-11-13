import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import OsfResourceModel from 'ember-osf-web/models/osf-resource';
import OsfUserModel from 'ember-osf-web/models/osf-user';

import OsfModel from './osf-model';
import AuthorizedStorageAccountModel from './authorized-storage-account';

export default class ConfiguredStorageAddonModel extends OsfModel {
    @attr('fixstring') storageProvider!: string;
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstring') rootFolder!: string;

    @belongsTo('osf-user', { inverse: 'configuredResources' })
    accountOwner!: AsyncBelongsTo<OsfUserModel> & OsfUserModel;

    @belongsTo('osf-resource', { inverse: 'configuredStorageAddons' })
    authorizedResource!: AsyncBelongsTo<OsfResourceModel> & OsfResourceModel;

    @belongsTo('authorized-storage-account')
    baseAccount!: AsyncBelongsTo<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-storage-addon': ConfiguredStorageAddonModel;
    } // eslint-disable-line semi
}
