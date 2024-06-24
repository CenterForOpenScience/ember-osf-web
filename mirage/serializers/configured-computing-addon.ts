import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import ConfiguredComputingAddonModel from 'ember-osf-web/models/configured-computing-addon';

import AddonServiceSerializer from './addon-service';

export interface MirageConfiguredComputingAddon extends ConfiguredComputingAddonModel {
    accountOwnerId: string;
    authorizedResourceId: string;
    baseAccountId: string;
    externalComputingServiceId: string;
}

export default class ConfiguredComputingAddonSerializer extends AddonServiceSerializer<ConfiguredComputingAddonModel> {
    buildRelationships(model: ModelInstance<MirageConfiguredComputingAddon>) {
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
            externalComputingService: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}external-computing-services/${model.externalComputingServiceId}/`,
                    },
                },
                data: {
                    id: model.externalComputingServiceId,
                    type: 'external-computing-services',
                },
            },
        };
    }
}
