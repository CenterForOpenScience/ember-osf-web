import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import AuthorizedStorageAccount from 'ember-osf-web/models/authorized-storage-account';

import AddonServiceSerializer from './addon-service';

interface MirageAuthorizedStorageAccount extends ModelInstance<AuthorizedStorageAccount> {
    accountOwnerId: string;
    externalStorageServiceId: string;
}

export default class AuthorizedStorageAccountSerializer extends AddonServiceSerializer<AuthorizedStorageAccount> {
    buildRelationships(model: MirageAuthorizedStorageAccount) {
        return {
            accountOwner: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}user-references/${model.accountOwnerId}/`,
                    },
                },
            },
            externalStorageService: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}external-storage-services/${model.externalStorageServiceId}/`,
                    },
                },
            },
        };
    }
}
