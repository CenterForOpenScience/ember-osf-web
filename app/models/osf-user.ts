import { AsyncHasMany, hasMany } from '@ember-data/model';

import AddonExternalAccountModel from './addon-external-account';
import AuthorizedStorageAccountModel from './authorized-storage-account';
import OsfResourceModel from './osf-resource';
import OsfModel from './osf-model';

export default class OsfUserModel extends OsfModel {
    @hasMany('authorized-storage-account', { inverse: null })
    authorizedStorageAccounts!: AsyncHasMany<AuthorizedStorageAccountModel> | AuthorizedStorageAccountModel[];

    @hasMany('external-account', { inverse: null })
    externalAccounts!: AsyncHasMany<AddonExternalAccountModel> |AddonExternalAccountModel[];

    @hasMany('osf-resource', { inverse: null })
    configuredResources!: AsyncHasMany<OsfResourceModel> | OsfResourceModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'osf-user': OsfUserModel;
    } // eslint-disable-line semi
}
