import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import AuthorizedCitationAccount from './authorized-citation-account';
import AuthorizedComputingAccount from './authorized-computing-account';
import ResourceReferenceModel from './resource-reference';

export default class UserReferenceModel extends Model {
    @attr('fixstring') userUri!: string;

    @hasMany('authorized-storage-account', { inverse: 'accountOwner' })
    authorizedStorageAccounts!: AsyncHasMany<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel[];

    @hasMany('authorized-citation-account', { inverse: 'accountOwner' })
    authorizedCitationAccounts!: AsyncHasMany<AuthorizedCitationAccount> &
        AuthorizedCitationAccount[];

    @hasMany('authorized-computing-account', { inverse: 'accountOwner' })
    authorizedComputingAccounts!: AsyncHasMany<AuthorizedComputingAccount>
        & AuthorizedComputingAccount[];

    @hasMany('resource-reference')
    configuredResources!: AsyncHasMany<ResourceReferenceModel> & ResourceReferenceModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-reference': UserReferenceModel;
    } // eslint-disable-line semi
}