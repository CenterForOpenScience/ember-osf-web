import Model, { attr } from '@ember-data/model';

export interface AddonCredentialFields {
    url?: string;
    username?: string;
    password?: string;
    token?: string;
    access_key?: string;
    secret_key?: string;
    repo?: string;
}

export default class AuthorizedAccountModel extends Model {
    @attr('fixstring') displayName!: string;
    @attr('fixstringarray') authorizedCapabilities!: string[];
    @attr('object') credentials?: AddonCredentialFields; // write-only
    @attr('boolean') initiateOauth!: boolean; // write-only
    @attr('fixstring') readonly authUrl!: string; // Only returned when POSTing to /authorized-xyz-accounts
    @attr('boolean') readonly credentialsAvailable!: boolean;
}
