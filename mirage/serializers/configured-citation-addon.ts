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
                        href: `${addonServiceAPIUrl}authorized-citation-accounts/${model.baseAccountId}/`,
                    },
                },
                data: {
                    id: model.baseAccountId,
                    type: 'authorized-citation-accounts',
                },
            },
            externalCitationService: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}external-citation-services/${model.externalCitationServiceId}/`,
                    },
                },
                data: {
                    id: model.externalCitationServiceId,
                    type: 'external-citation-services',
                },
            },
        };
    }
}
