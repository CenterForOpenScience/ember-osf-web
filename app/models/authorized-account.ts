import Model, { attr } from '@ember-data/model';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { ConnectedOperationNames, OperationKwargs } from 'ember-osf-web/models/addon-operation-invocation';

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

    @task
    @waitFor
    async getFolderItems(this: AuthorizedAccountModel, kwargs?: OperationKwargs) {
        const operationKwargs = kwargs || {};
        const operationName = operationKwargs.itemId ? ConnectedOperationNames.ListChildItems :
            ConnectedOperationNames.ListRootItems;
        const newInvocation = this.store.createRecord('addon-operation-invocation', {
            operationName,
            operationKwargs,
            thruAccount: this,
        });
        return await newInvocation.save();
    }

    @task
    @waitFor
    async getItemInfo(this: AuthorizedAccountModel, itemId: string) {
        const newInvocation = this.store.createRecord('addon-operation-invocation', {
            operationName: ConnectedOperationNames.GetItemInfo,
            operationKwargs: { itemId },
            thruAccount: this,
        });
        return await newInvocation.save();
    }
}
