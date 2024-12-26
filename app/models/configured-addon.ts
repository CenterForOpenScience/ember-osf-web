import Model, { attr } from '@ember-data/model';

import { ConnectedStorageOperationNames, OperationKwargs } from './addon-operation-invocation';
import AuthorizedAccountModel, { ConnectedCapabilities } from './authorized-account';

export interface ConfiguredAddonEditableAttrs {
    displayName: string;
    rootFolder: string;
}

export default class ConfiguredAddonModel extends Model {
    @attr('string') displayName!: string;
    @attr('fixstring') externalUserId!: string;
    @attr('fixstring') externalUserDisplayName!: string;

    @attr('string') iconUrl!: string;
    @attr('string') authorizedResourceUri?: string;

    @attr('array') connectedCapabilities!: ConnectedCapabilities[];
    @attr('array') connectedOperationNames!: ConnectedStorageOperationNames[];
    @attr('fixstring') rootFolder!: string;

    @attr('boolean')
    currentUserIsOwner!: boolean;

    async getFolderItems(this: AuthorizedAccountModel, _kwargs?: OperationKwargs) : Promise<any> {
        // To be implemented in child classes
        return;
    }


    async getItemInfo(this: AuthorizedAccountModel, _itemId: string) : Promise<any> {
        // To be implemented in child classes
        return;
    }
}
