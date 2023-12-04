import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import AuthorizedStorageAccount from 'ember-osf-web/models/authorized-storage-account';

import ApplicationSerializer from './application';

export default class AuthorizedStorageAccountSerializer extends ApplicationSerializer<AuthorizedStorageAccount> {
    buildRelationships(model: ModelInstance<AuthorizedStorageAccount>) {
        return {
            configuringUser: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}internal_users/${model.configuringUser.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'configuringUser'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<AuthorizedStorageAccount>) {
        return {
            self: `${addonServiceAPIUrl}authorized_storage_accounts/${model.id}/`,
        };
    }
}
