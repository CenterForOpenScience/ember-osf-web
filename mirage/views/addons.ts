import { HandlerContext, ModelInstance, NormalizedRequestAttrs, Request, Response, Schema } from 'ember-cli-mirage';

import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';
import FileProviderModel from 'ember-osf-web/models/file-provider';

import { MirageConfiguredStorageAddon } from '../serializers/configured-storage-addon';
import { filter, process } from './utils';

// This is the handler for the unofficial node/addons endpoint
// It is only being used by the file-action-menu component to determine if a node has the BoA addon enabled
// It is not being used by the official OSF API
export function addonsList(this: HandlerContext, schema: Schema, request: Request) {
    const { parentID } = request.params;
    const node = schema.nodes.find(parentID);
    if (!node) {
        return;
    }
    const addons = node.files.models.map((addon: ModelInstance<FileProviderModel>) => {
        const data = this.serialize(addon).data;
        data.id = addon.name;
        data.type = 'node-addons';
        data.attributes = {
            node_has_auth: true,
            configured: false,
            external_account_id: '1234',
            folder_id: null,
            folder_path: null,
        };
        return data;
    });
    if (node.boaEnabled) {
        addons.push({
            id: 'boa',
            type: 'node-addons',
            attributes: {
                node_has_auth: true,
                configured: false,
                external_account_id: '1234',
                folder_id: null,
                folder_path: null,
            },
        });
    }

    return new Response(200, {}, {
        data: addons,
    });
}

export function userReferenceAuthorizedStorageAccountList(this: HandlerContext, schema: Schema, request: Request) {
    const { userGuid } = request.params;
    const userReference = schema.userReferences.find(userGuid);
    const authorizedStorageAccounts = userReference.attrs.authorizedStorageAccountIds.map(
        (id: string) => schema.authorizedStorageAccounts.find(id),
    );
    const filteredStorageAccounts = authorizedStorageAccounts.filter((addon: ModelInstance) => filter(addon, request));
    const data = filteredStorageAccounts.map((account: ModelInstance) => this.serialize(account).data);
    return process(schema, request, this, data);
}

export function userAuthorizedCitationServiceAccountList(this: HandlerContext, schema: Schema, request: Request) {
    const { userGuid } = request.params;
    const userReference = schema.userReferences.find(userGuid);
    const authorizedCitationAccounts = userReference.attrs.authorizedCitationServiceAccountIds.map(
        (id: string) => schema.authorizedCitationServiceAccounts.find(id),
    );
    const filteredCitationAccounts = authorizedCitationAccounts.filter(
        (addon: ModelInstance) => filter(addon, request),
    );
    const data = filteredCitationAccounts.map((account: ModelInstance) => this.serialize(account).data);
    return process(schema, request, this, data);
}

export function userAuthorizedCloudComputingAccountList(this: HandlerContext, schema: Schema, request: Request) {
    const { userGuid } = request.params;
    const userReference = schema.userReferences.find(userGuid);
    const authorizedCloudComputingAccounts = userReference.attrs.authorizedCloudComputingAccountIds.map(
        (id: string) => schema.authorizedCloudComputingAccounts.find(id),
    );
    const filteredCitationAccounts = authorizedCloudComputingAccounts.filter(
        (addon: ModelInstance) => filter(addon, request),
    );
    const data = filteredCitationAccounts.map((account: ModelInstance) => this.serialize(account).data);
    return process(schema, request, this, data);
}


export function resourceReferenceConfiguredStorageAddonList(this: HandlerContext, schema: Schema, request: Request) {
    const { nodeGuid } = request.params;
    const resourceReference = schema.resourceReferences.find(nodeGuid);
    const configuredStorageAddons = resourceReference.attrs.configuredStorageAddonIds.map(
        (id: string) => schema.configuredStorageAddons.find(id),
    );
    const filteredStorageAddons = configuredStorageAddons.filter((addon: ModelInstance) => filter(addon, request));
    const data = filteredStorageAddons.map((addon: ModelInstance) => this.serialize(addon).data);
    const processed = process(schema, request, this, data);
    return processed;
}

export function createConfiguredStorageAddon(this: HandlerContext, schema: Schema) {
    const attrs =
        this.normalizedRequestAttrs('configured-storage-addon') as NormalizedRequestAttrs<MirageConfiguredStorageAddon>;
    const configuredStorageAddon = schema.configuredStorageAddons.create(attrs);

    const baseAccount = schema.authorizedStorageAccounts
        .find(attrs.baseAccountId) as ModelInstance<AuthorizedStorageAccountModel>;
    configuredStorageAddon.update({
        externalUserId: baseAccount.externalUserId,
        externalUserDisplayName: baseAccount.externalUserDisplayName,
    });

    return configuredStorageAddon;
}
