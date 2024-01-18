import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import InternalUserModel from 'ember-osf-web/models/internal-user';

import AddonServiceSerializer from './addon-service-serializer';

export default class InternalUserSerializer extends AddonServiceSerializer {
    buildRelationships(model: ModelInstance<InternalUserModel>) {
        return {
            authorizedStorageAccounts: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}internal-users/${model.id}/authorized-storage-accounts/`,
                    },
                },
            },
            configuredResources: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}internal-users/${model.id}/configured-resources/`,
                    },
                },
            },
        };
    }
}
