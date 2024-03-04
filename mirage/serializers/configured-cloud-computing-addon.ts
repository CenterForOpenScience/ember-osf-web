import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import ConfiguredCloudComputingAddonModel from 'ember-osf-web/models/configured-cloud-computing-addon';

import AddonServiceSerializer from './addon-service-serializer';

export interface MirageConfiguredCloudComputingAddon extends ConfiguredCloudComputingAddonModel {
    accountOwnerId: string;
    authorizedResourceId: string;
    baseAccountId: string;
    cloudComputingServiceId: string;
}

export default class ConfiguredCloudComputingAddonSerializer extends AddonServiceSerializer {
    buildRelationships(model: ModelInstance<MirageConfiguredCloudComputingAddon>) {
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
            cloudComputingService: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}cloud-computing-services/${model.cloudComputingServiceId}/`,
                    },
                },
            },
        };
    }
}
