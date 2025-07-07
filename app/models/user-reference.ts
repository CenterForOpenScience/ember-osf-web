import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';

import AuthorizedLinkAccountModel from 'ember-osf-web/models/authorized-link-account';
import AuthorizedStorageAccountModel from './authorized-storage-account';
import AuthorizedCitationAccountModel from './authorized-citation-account';
import AuthorizedComputingAccountModel from './authorized-computing-account';
import ResourceReferenceModel from './resource-reference';

export default class UserReferenceModel extends Model {
    @attr('fixstring') userUri!: string;

    @hasMany('authorized-storage-account', { inverse: 'accountOwner' })
    authorizedStorageAccounts!: AsyncHasMany<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel[];

    @hasMany('authorized-citation-account', { inverse: 'accountOwner' })
    authorizedCitationAccounts!: AsyncHasMany<AuthorizedCitationAccountModel> &
        AuthorizedCitationAccountModel[];

    @hasMany('authorized-computing-account', { inverse: 'accountOwner' })
    authorizedComputingAccounts!: AsyncHasMany<AuthorizedComputingAccountModel>
        & AuthorizedComputingAccountModel[];

    @hasMany('authorized-link-account', { inverse: 'accountOwner' })
    authorizedLinkAccounts!: AsyncHasMany<AuthorizedLinkAccountModel>
        & AuthorizedLinkAccountModel[];

    @hasMany('resource-reference')
    configuredResources!: AsyncHasMany<ResourceReferenceModel> & ResourceReferenceModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-reference': UserReferenceModel;
    } // eslint-disable-line semi
}
