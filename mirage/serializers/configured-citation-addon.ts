import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import ConfiguredCitationAddonModel from 'ember-osf-web/models/configured-citation-addon';

import AddonServiceSerializer from './addon-service';

export interface MirageConfiguredCitationAddon extends ConfiguredCitationAddonModel {
    accountOwnerId: string;
    authorizedResourceId: string;
    baseAccountId: string;
    externalCitationServiceId: string;
}

export default class ConfiguredCitationAddonSerializer extends AddonServiceSerializer<ConfiguredCitationAddonModel> {
    buildRelationships(model: ModelInstance<MirageConfiguredCitationAddon>) {
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
            externalCitationService: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}external-citation-services/${model.externalCitationServiceId}/`,
                    },
                },
            },
        };
    }
}
