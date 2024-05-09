import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

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

export default class AuthorizedAccountModel extends OsfModel {
    @attr('fixstring') displayName!: string;
    @attr('fixstringarray') scopes!: string[];
    @attr('object') credentials?: AddonCredentialFields; // write-only
    @attr('fixstring') readonly authUrl!: string; // Only returned when POSTing to /authorized-xyz-accounts
    @attr('boolean') readonly credentialsAvailable!: boolean;

    @belongsTo('user-reference', { inverse: 'authorizedStorageAccounts' })
    configuringUser!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;
}
