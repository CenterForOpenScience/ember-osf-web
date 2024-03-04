import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';
import AddonServiceSerializer from './addon-service-serializer';

export default class ResourceReferenceSerializer extends AddonServiceSerializer {
    buildRelationships(model: ModelInstance<ResourceReferenceModel>) {
        return {
            configuredStorageAddons: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}resource-references/${model.id}/configured-storage-addons`,
                    },
                },
            },
            configuredCitationServiceAddons: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}resource-references/${model.id}/configured-citation-service-addons`,
                    },
                },
            },
            configuredCloudComputingAddons: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}resource-references/${model.id}/configured-cloud-computing-addons`,
                    },
                },
            },
        };
    }
}
