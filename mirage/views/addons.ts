import { HandlerContext, ModelInstance, NormalizedRequestAttrs, Request, Response, Schema } from 'ember-cli-mirage';

import AuthorizedCitationAccountModel from 'ember-osf-web/models/authorized-citation-account';
import AuthorizedComputingAccountModel from 'ember-osf-web/models/authorized-computing-account';
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';
import FileProviderModel from 'ember-osf-web/models/file-provider';

import { MirageConfiguredComputingAddon } from '../serializers/configured-computing-addon';
import { MirageConfiguredCitationAddon } from '../serializers/configured-citation-addon';
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
    const { authorizedStorageAccountIds } = userReference.attrs;
    if (!authorizedStorageAccountIds) {
        return process(schema, request, this, []);
    }
    const authorizedStorageAccounts = authorizedStorageAccountIds.map(
        (id: string) => schema.authorizedStorageAccounts.find(id),
    );
    const filteredStorageAccounts = authorizedStorageAccounts.filter((addon: ModelInstance) => filter(addon, request));
    const data = filteredStorageAccounts.map((account: ModelInstance) => this.serialize(account).data);
    return process(schema, request, this, data);
}

export function userAuthorizedCitationAccountList(this: HandlerContext, schema: Schema, request: Request) {
    const { userGuid } = request.params;
    const userReference = schema.userReferences.find(userGuid);
    const { authorizedCitationAccountIds } = userReference.attrs;
    if (!authorizedCitationAccountIds) {
        return process(schema, request, this, []);
    }
    const authorizedCitationAccounts = authorizedCitationAccountIds.map(
        (id: string) => schema.authorizedCitationAccounts.find(id),
    );
    const filteredCitationAccounts = authorizedCitationAccounts.filter(
        (addon: ModelInstance) => filter(addon, request),
    );
    const data = filteredCitationAccounts.map((account: ModelInstance) => this.serialize(account).data);
    return process(schema, request, this, data);
}

export function userAuthorizedComputingAccountList(this: HandlerContext, schema: Schema, request: Request) {
    const { userGuid } = request.params;
    const userReference = schema.userReferences.find(userGuid);
    const { authorizedComputingAccountIds } = userReference.attrs;
    if (!authorizedComputingAccountIds) {
        return process(schema, request, this, []);
    }
    const authorizedComputingAccounts = authorizedComputingAccountIds.map(
        (id: string) => schema.authorizedComputingAccounts.find(id),
    );
    const filteredCitationAccounts = authorizedComputingAccounts.filter(
        (addon: ModelInstance) => filter(addon, request),
    );
    const data = filteredCitationAccounts.map((account: ModelInstance) => this.serialize(account).data);
    return process(schema, request, this, data);
}


export function resourceReferenceConfiguredStorageAddonList(this: HandlerContext, schema: Schema, request: Request) {
    const { nodeGuid } = request.params;
    const resourceReference = schema.resourceReferences.find(nodeGuid);
    const { configuredStorageAddonIds } = resourceReference.attrs;
    if (!configuredStorageAddonIds) {
        return process(schema, request, this, []);
    }
    const configuredStorageAddons = configuredStorageAddonIds.map(
        (id: string) => schema.configuredStorageAddons.find(id),
    );
    const filteredStorageAddons = configuredStorageAddons.filter((addon: ModelInstance) => filter(addon, request));
    const data = filteredStorageAddons.map((addon: ModelInstance) => this.serialize(addon).data);
    const processed = process(schema, request, this, data);
    return processed;
}

export function resourceConfiguredCitationAddonList(this: HandlerContext, schema: Schema, request: Request) {
    const { nodeGuid } = request.params;
    const resourceReference = schema.resourceReferences.find(nodeGuid);
    const { configuredCitationAddonIds } = resourceReference.attrs;
    if (!configuredCitationAddonIds) {
        return process(schema, request, this, []);
    }
    const configuredCitationAddons = configuredCitationAddonIds.map(
        (id: string) => schema.configuredCitationAddons.find(id),
    );
    const filteredCitationAddons = configuredCitationAddons.filter((addon: ModelInstance) => filter(addon, request));
    const data = filteredCitationAddons.map((addon: ModelInstance) => this.serialize(addon).data);
    const processed = process(schema, request, this, data);
    return processed;
}

export function resourceConfiguredComputingAddonList(this: HandlerContext, schema: Schema, request: Request) {
    const { nodeGuid } = request.params;
    const resourceReference = schema.resourceReferences.find(nodeGuid);
    const { configuredComputingAddonIds } = resourceReference.attrs;
    if (!configuredComputingAddonIds) {
        return process(schema, request, this, []);
    }
    const configuredComputingAddons = configuredComputingAddonIds.map(
        (id: string) => schema.configuredComputingAddons.find(id),
    );
    const filteredComputingAddons = configuredComputingAddons
        .filter((addon: ModelInstance) => filter(addon, request));
    const data = filteredComputingAddons.map((addon: ModelInstance) => this.serialize(addon).data);
    const processed = process(schema, request, this, data);
    return processed;
}

export function resourceReferencesList(this: HandlerContext, schema: Schema, request: Request) {
    const resourceReferences = schema.resourceReferences.all().models;
    const filteredresourceReferences = resourceReferences.filter((addon: ModelInstance) => filter(addon, request));
    const data = filteredresourceReferences.map((addon: ModelInstance) => this.serialize(addon).data);
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

export function createConfiguredCitationAddon(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs(
        'configured-citation-addon',
    ) as NormalizedRequestAttrs<MirageConfiguredCitationAddon>;
    const configuredCitationAddon = schema.configuredCitationAddons.create(attrs);

    const baseAccount = schema.authorizedCitationAccounts
        .find(attrs.baseAccountId) as ModelInstance<AuthorizedCitationAccountModel>;
    configuredCitationAddon.update({
        externalUserId: baseAccount.externalUserId,
        externalUserDisplayName: baseAccount.externalUserDisplayName,
    });

    return configuredCitationAddon;
}

export function createConfiguredComputingAddon(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs(
        'configured-computing-addon',
    ) as NormalizedRequestAttrs<MirageConfiguredComputingAddon>;
    const configuredComputingAddon = schema.configuredComputingAddons.create(attrs);

    const baseAccount = schema.authorizedComputingAccounts
        .find(attrs.baseAccountId) as ModelInstance<AuthorizedComputingAccountModel>;
    configuredComputingAddon.update({
        externalUserId: baseAccount.externalUserId,
        externalUserDisplayName: baseAccount.externalUserDisplayName,
    });

    return configuredComputingAddon;
}
