import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

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

export default class AuthorizedStorageAccountModel extends OsfModel {
    @attr('fixstring') displayName!: string;
    @attr('fixstringarray') scopes!: string[];
    @attr('object') credentials?: AddonCredentialFields; // write-only
    @attr('fixstring') apiBaseUrl!: string; // Only applicable when ExternalStorageService.configurableApiRoot
    @attr('fixstring') readonly authUrl!: string; // Only returned when POSTing to /authorized-storage-accounts
    @attr('boolean') readonly credentialsAvailable!: boolean;

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
