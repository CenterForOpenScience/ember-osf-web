import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';

import ApplicationSerializer from './application';

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
                        href: `${addonServiceAPIUrl}internal_users/${model.accountOwnerId}/`,
                        meta: this.buildRelatedLinkMeta(model, 'accountOwner'),
                    },
                },
            },
            authorizedResource: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}internal_resources/${model.authorizedResourceId}/`,
                        meta: this.buildRelatedLinkMeta(model, 'authorizedResource'),
                    },
                },
            },
            baseAccount: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}authorized_storage_accounts/${model.baseAccountId}/`,
                        meta: this.buildRelatedLinkMeta(model, 'baseAccount'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<ConfiguredStorageAddonModel>) {
        return {
            self: `${addonServiceAPIUrl}configured_storage_addons/${model.id}/`,
        };
    }
}
