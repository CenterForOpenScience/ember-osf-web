import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';

import ApplicationSerializer from './application';

const { addonServiceUrl } = config.OSF;

export default class ConfiguredStorageAddonSerializer extends ApplicationSerializer<ConfiguredStorageAddonModel> {
    buildRelationships(model: ModelInstance<ConfiguredStorageAddonModel>) {
        return {
            accountOwner: {
                links: {
                    related: {
                        href: `${addonServiceUrl}/internal_users/${model.accountOwner.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'accountOwner'),
                    },
                },
            },
            authorizedResource: {
                links: {
                    related: {
                        href: `${addonServiceUrl}/internal_resources/${model.authorizedResource.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'authorizedResource'),
                    },
                },
            },
            baseAccount: {
                links: {
                    related: {
                        href: `${addonServiceUrl}/authorized_storage_accounts/${model.baseAccount.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'baseAccount'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<ConfiguredStorageAddonModel>) {
        return {
            self: `${addonServiceUrl}/configured_storage_addons/${model.id}/`,
        };
    }
}
