import Model, { attr} from '@ember-data/model';
import { OperationKwargs } from 'ember-osf-web/models/addon-operation-invocation';

export enum ConnectedCapabilities {
    Access = 'ACCESS',
    Update = 'UPDATE',
}

export interface AddonCredentialFields {
    username?: string;
    password?: string;
    access_token?: string;
    access_key?: string;
    secret_key?: string;
    repo?: string;
}

export interface AccountCreationArgs {
    credentials?: AddonCredentialFields;
    apiBaseUrl?: string;
    displayName: string;
    initiateOauth?: boolean;
}

export default class AuthorizedAccountModel extends Model {
    @attr('fixstring') displayName!: string;
    @attr('fixstringarray') authorizedCapabilities!: string[];
    @attr('fixstring') apiBaseUrl?: string; // Only applicable when ExternalService.configurableApiRoot === true
    @attr('object') credentials?: AddonCredentialFields; // write-only
    @attr('boolean') initiateOauth!: boolean; // write-only
    @attr('fixstring') readonly authUrl!: string; // Only returned when POSTing to /authorized-xyz-accounts
    @attr('boolean') readonly credentialsAvailable!: boolean;

    async getFolderItems(this: AuthorizedAccountModel, _kwargs?: OperationKwargs) : Promise<any> {
        // To be implemented in child classes
        return;
    }

    async getItemInfo(this: AuthorizedAccountModel, _itemId: string) : Promise<any> {
        // To be implemented in child classes
        return;
    }
}
