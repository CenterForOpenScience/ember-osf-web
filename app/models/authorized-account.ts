import Model, { attr } from '@ember-data/model';

export interface AddonCredentialFields {
    url?: string;
    username?: string;
    password?: string;
    token?: string;
    accessKey?: string;
    secretKey?: string;
    repo?: string;
}

export default class AuthorizedAccountModel extends Model {
    @attr('fixstring') displayName!: string;
    @attr('fixstringarray') authorizedCapabilities!: string[];
    @attr('fixstring') apiBaseUrl!: string; // Only applicable when ExternalService.configurableApiRoot === true
    @attr('object') credentials?: AddonCredentialFields; // write-only
    @attr('boolean') initiateOauth!: boolean; // write-only
    @attr('fixstring') readonly authUrl!: string; // Only returned when POSTing to /authorized-xyz-accounts
    @attr('boolean') readonly credentialsAvailable!: boolean;
}
