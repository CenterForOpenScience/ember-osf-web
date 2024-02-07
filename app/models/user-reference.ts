import { AsyncHasMany, hasMany } from '@ember-data/model';

import AuthorizedStorageAccountModel from './authorized-storage-account';
import ResourceReferenceModel from './resource-reference';
import OsfModel from './osf-model';

export default class UserReferenceModel extends OsfModel {
    @hasMany('authorized-storage-account', { inverse: 'configuringUser' })
    authorizedStorageAccounts!: AsyncHasMany<AuthorizedStorageAccountModel> & AuthorizedStorageAccountModel[];

    @hasMany('resource-reference')
    configuredResources!: AsyncHasMany<ResourceReferenceModel> & ResourceReferenceModel[];
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-reference': UserReferenceModel;
    } // eslint-disable-line semi
}