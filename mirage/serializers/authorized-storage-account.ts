import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import AuthorizedStorageAccount from 'ember-osf-web/models/authorized-storage-account';

import ApplicationSerializer from './application';

const { addonServiceUrl } = config.OSF;

export default class AuthorizedStorageAccountSerializer extends ApplicationSerializer<AuthorizedStorageAccount> {
    buildRelationships(model: ModelInstance<AuthorizedStorageAccount>) {
        return {
            configuringUser: {
                links: {
                    related: {
                        href: `${addonServiceUrl}/osf_users/${model.configuringUser.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'configuringUser'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<AuthorizedStorageAccount>) {
        return {
            self: `${addonServiceUrl}/authorized_storage_accounts/${model.id}/`,
        };
    }
}
