import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import { OsfLinks } from './osf-model';
import ExternalStorageServiceModel from './external-storage-service';
import UserReferenceModel from './user-reference';
import OsfModel from './osf-model';

export interface AddonCredentialFields {
    url: string;
    username: string;
    password: string;
    token: string;
    accessKey: string;
    secretKey: string;
    repo: string;
}

export interface AuthorizedAccountLinks extends OsfLinks {
    auth?: string; // Returned when POSTing to /authorized-xyz-accounts
}


export default class AuthorizedStorageAccountModel extends OsfModel {
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;
    @attr('fixstringarray') scopes!: string[];
    @attr('object') links!: AuthorizedAccountLinks;
    @attr('object') credentials?: AddonCredentialFields; // write-only
    @attr('boolean') readonly isAuthorized!: boolean;

    @belongsTo('external-storage-service')
    storageProvider!: AsyncBelongsTo<ExternalStorageServiceModel> & ExternalStorageServiceModel;

    @belongsTo('user-reference', { inverse: 'authorizedStorageAccounts' })
    configuringUser!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'authorized-storage-account': AuthorizedStorageAccountModel;
    } // eslint-disable-line semi
}
