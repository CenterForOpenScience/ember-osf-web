import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import AuthorizedStorageAccount from 'ember-osf-web/models/authorized-storage-account';

import ApplicationSerializer from './application';

interface MirageAuthorizedStorageAccount extends ModelInstance<AuthorizedStorageAccount> {
    configuringUserId: string;
    storageProviderId: string;
}

export default class AuthorizedStorageAccountSerializer extends ApplicationSerializer<AuthorizedStorageAccount> {
    buildRelationships(model: MirageAuthorizedStorageAccount) {
        return {
            configuringUser: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}user-references/${model.configuringUserId}/`,
                    },
                },
            },
            storageProvider: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}external-storage-services/${model.storageProviderId}/`,
                    },
                },
            },
        };
    }
}
