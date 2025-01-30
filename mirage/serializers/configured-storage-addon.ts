import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';

import AddonServiceSerializer from './addon-service';

export interface MirageConfiguredStorageAddon extends ConfiguredStorageAddonModel {
    accountOwnerId: string;
    authorizedResourceId: string;
    baseAccountId: string;
    externalStorageServiceId: string;
}

export default class ConfiguredStorageAddonSerializer extends AddonServiceSerializer<ConfiguredStorageAddonModel> {
    buildRelationships(model: ModelInstance<MirageConfiguredStorageAddon>) {
        return {
            accountOwner: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}user-references/${model.accountOwnerId}/`,
                    },
                },
                data: {
                    id: model.accountOwnerId,
                    type: 'user-references',
                },
            },
            authorizedResource: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}resource-references/${model.authorizedResourceId}/`,
                    },
                },
                data: {
                    id: model.authorizedResourceId,
                    type: 'resource-references',
                },
            },
            baseAccount: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}authorized-storage-accounts/${model.baseAccountId}/`,
                    },
                },
                data: {
                    id: model.baseAccountId,
                    type: 'authorized-storage-accounts',
                },
            },
            externalStorageService: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}external-storage-services/${model.externalStorageServiceId}/`,
                    },
                },
                data: {
                    id: model.externalStorageServiceId,
                    type: 'external-storage-services',
                },
            },
        };
    }
}
