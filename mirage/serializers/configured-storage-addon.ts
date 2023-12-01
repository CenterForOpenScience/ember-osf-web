import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';

import ApplicationSerializer from './application';

const { addonServiceUrl } = config.OSF;

interface MirageConfiguredStorageAddon extends ConfiguredStorageAddonModel {
    accountOwnerId: string;
    authorizedResourceId: string;
    baseAccountId: string;
}

export default class ConfiguredStorageAddonSerializer extends ApplicationSerializer<MirageConfiguredStorageAddon> {
    buildRelationships(model: ModelInstance<MirageConfiguredStorageAddon>) {
        return {
            accountOwner: {
                links: {
                    related: {
                        href: `${addonServiceUrl}v1/internal_users/${model.accountOwnerId}/`,
                        meta: this.buildRelatedLinkMeta(model, 'accountOwner'),
                    },
                },
            },
            authorizedResource: {
                links: {
                    related: {
                        href: `${addonServiceUrl}v1/internal_resources/${model.authorizedResourceId}/`,
                        meta: this.buildRelatedLinkMeta(model, 'authorizedResource'),
                    },
                },
            },
            baseAccount: {
                links: {
                    related: {
                        href: `${addonServiceUrl}v1/authorized_storage_accounts/${model.baseAccountId}/`,
                        meta: this.buildRelatedLinkMeta(model, 'baseAccount'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<ConfiguredStorageAddonModel>) {
        return {
            self: `${addonServiceUrl}v1/configured_storage_addons/${model.id}/`,
        };
    }
}
