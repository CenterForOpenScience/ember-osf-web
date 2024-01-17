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
                        href: `${addonServiceAPIUrl}internal-users/${model.accountOwnerId}/`,
                        meta: this.buildRelatedLinkMeta(model, 'accountOwner'),
                    },
                },
            },
            authorizedResource: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}internal-resources/${model.authorizedResourceId}/`,
                        meta: this.buildRelatedLinkMeta(model, 'authorizedResource'),
                    },
                },
            },
            baseAccount: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}authorized-storage-accounts/${model.baseAccountId}/`,
                        meta: this.buildRelatedLinkMeta(model, 'baseAccount'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<ConfiguredStorageAddonModel>) {
        return {
            self: `${addonServiceAPIUrl}configured-storage-addons/${model.id}/`,
        };
    }
}
