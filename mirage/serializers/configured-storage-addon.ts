import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';

import AddonServiceSerializer from './addon-service-serializer';

interface MirageConfiguredStorageAddon extends ConfiguredStorageAddonModel {
    accountOwnerId: string;
    authorizedResourceId: string;
    baseAccountId: string;
    storageProviderId: string;
}

export default class ConfiguredStorageAddonSerializer extends AddonServiceSerializer {
    buildRelationships(model: ModelInstance<MirageConfiguredStorageAddon>) {
        return {
            accountOwner: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}user-references/${model.accountOwnerId}/`,
                    },
                },
            },
            authorizedResource: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}resource-references/${model.authorizedResourceId}/`,
                    },
                },
            },
            baseAccount: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}authorized-storage-accounts/${model.baseAccountId}/`,
                    },
                },
            },
            storageProvider: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}external-storage-services/${model.storageProviderId}/`,
                    },
                },
            },
        };
    }
}
