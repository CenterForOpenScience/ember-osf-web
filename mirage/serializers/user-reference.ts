import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import UserReferenceModel from 'ember-osf-web/models/user-reference';

import AddonServiceSerializer from './addon-service-serializer';

export default class UserReferenceSerializer extends AddonServiceSerializer {
    buildRelationships(model: ModelInstance<UserReferenceModel>) {
        return {
            authorizedStorageAccounts: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}user-references/${model.id}/authorized-storage-accounts/`,
                    },
                },
            },
            authorizedCitationServiceAccounts: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}user-references/${model.id}/authorized-citation-service-accounts/`,
                    },
                },
            },
            authorizedCloudComputingAccounts: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}user-references/${model.id}/authorized-cloud-computing-accounts/`,
                    },
                },
            },
            configuredResources: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}user-references/${model.id}/configured-resources/`,
                    },
                },
            },
        };
    }
}
