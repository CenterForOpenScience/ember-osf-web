import { AsyncHasMany, hasMany } from '@ember-data/model';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import InternalResourceModel from './internal-resource';
import OsfModel from './osf-model';

export default class InternalUserModel extends OsfModel {
    @hasMany('authorized-storage-account', { inverse: 'configuringUser' })
    authorizedStorageAccounts!: AsyncHasMany<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel[];

    @hasMany('internal-resource')
    configuredResources!: AsyncHasMany<InternalResourceModel> & InternalResourceModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'internal-user': InternalUserModel;
    } // eslint-disable-line semi
}
