import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import ConfiguredCitationServiceAddonModel from 'ember-osf-web/models/configured-citation-service-addon';

import AddonServiceSerializer from './addon-service-serializer';

export interface MirageConfiguredCitationServiceAddon extends ConfiguredCitationServiceAddonModel {
    accountOwnerId: string;
    authorizedResourceId: string;
    baseAccountId: string;
    citationServiceId: string;
}

export default class ConfiguredCitationAddonSerializer extends AddonServiceSerializer {
    buildRelationships(model: ModelInstance<MirageConfiguredCitationServiceAddon>) {
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
            citationService: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}citation-services/${model.citationServiceId}/`,
                    },
                },
            },
        };
    }
}
