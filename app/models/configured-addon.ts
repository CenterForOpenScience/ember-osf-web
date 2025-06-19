import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';

import UserReferenceModel from 'ember-osf-web/models/user-reference';
import { tracked } from 'tracked-built-ins';
import { SupportedResourceTypes } from 'ember-osf-web/models/external-link-service';
// import ConfiguredLinkAddonModel from 'ember-osf-web/models/configured-link-addon';
import { ConnectedStorageOperationNames, OperationKwargs } from './addon-operation-invocation';
import { ConnectedCapabilities } from './authorized-account';


export interface ConfiguredAddonEditableAttrs {
    displayName: string;
    rootFolder: string;
    targetId: string;
    resourceType: SupportedResourceTypes;
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
    @attr('fixstring') externalServiceName!: string;

    @belongsTo('user-reference', { inverse: null })
    accountOwner!: AsyncBelongsTo<UserReferenceModel> & UserReferenceModel;

    @attr('boolean')
    currentUserIsOwner!: boolean;

    async getFolderItems(this: ConfiguredAddonModel, _kwargs?: OperationKwargs) : Promise<any> {
        // To be implemented in child classes
        return;
    }


    async getItemInfo(this: ConfiguredAddonModel, _itemId: string) : Promise<any> {
        // To be implemented in child classes
        return;
    }

    get hasRootFolder() {
        return true;

    }

    @tracked rootFolderName = '';
    @tracked targetItemName = '';
}
