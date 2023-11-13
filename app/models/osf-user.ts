import { AsyncHasMany, hasMany } from '@ember-data/model';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import OsfResourceModel from './osf-resource';
import OsfModel from './osf-model';

export default class OsfUserModel extends OsfModel {
    @hasMany('authorized-storage-account', { inverse: 'configuringUser' })
    authorizedStorageAccounts!: AsyncHasMany<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel[];

    @hasMany('osf-resource')
    configuredResources!: AsyncHasMany<OsfResourceModel> & OsfResourceModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'osf-user': OsfUserModel;
    } // eslint-disable-line semi
}
