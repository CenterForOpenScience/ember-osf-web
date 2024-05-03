import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import ConfiguredComputingAddonModel from 'ember-osf-web/models/configured-computing-addon';

import ApplicationSerializer from './application';

export interface MirageConfiguredComputingAddon extends ConfiguredComputingAddonModel {
    accountOwnerId: string;
    authorizedResourceId: string;
    baseAccountId: string;
    externalComputingServiceId: string;
}

export default class ConfiguredComputingAddonSerializer extends ApplicationSerializer<ConfiguredComputingAddonModel> {
    buildRelationships(model: ModelInstance<MirageConfiguredComputingAddon>) {
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
            externalComputingService: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}external-computing-services/${model.externalComputingServiceId}/`,
                    },
                },
            },
        };
    }
}
