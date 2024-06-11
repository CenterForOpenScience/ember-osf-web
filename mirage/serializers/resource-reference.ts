import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';
import AddonServiceSerializer from './addon-service';

export default class ResourceReferenceSerializer extends AddonServiceSerializer<ResourceReferenceModel> {
    buildRelationships(model: ModelInstance<ResourceReferenceModel>) {
        return {
            configuredStorageAddons: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}resource-references/${model.id}/configured_storage_addons`,
                    },
                },
            },
            configuredCitationAddons: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}resource-references/${model.id}/configured_citation_addons`,
                    },
                },
            },
            configuredComputingAddons: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}resource-references/${model.id}/configured_computing_addons`,
                    },
                },
            },
        };
    }
}
