import { AsyncHasMany, hasMany } from '@ember-data/model';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import AuthorizedCitationServiceAccount from './authorized-citation-service-account';
import AuthorizedComputingAccount from './authorized-computing-account';
import ResourceReferenceModel from './resource-reference';
import OsfModel from './osf-model';

export default class UserReferenceModel extends OsfModel {
    @hasMany('authorized-storage-account', { inverse: 'configuringUser' })
    authorizedStorageAccounts!: AsyncHasMany<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel[];

    @hasMany('authorized-citation-service-account', { inverse: 'configuringUser' })
    authorizedCitationServiceAccounts!: AsyncHasMany<AuthorizedCitationServiceAccount> &
        AuthorizedCitationServiceAccount[];

    @hasMany('authorized-computing-account', { inverse: 'configuringUser' })
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
