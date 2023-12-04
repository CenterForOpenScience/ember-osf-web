import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import InternalUserModel from 'ember-osf-web/models/internal-user';

import ApplicationSerializer from './application';

export default class InternalUserSerializer extends ApplicationSerializer<InternalUserModel> {
    buildRelationships(model: ModelInstance<InternalUserModel>) {
        return {
            authorizedStorageAccounts: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}internal_users/${model.id}/authorized_storage_accounts`,
                        meta: this.buildRelatedLinkMeta(model, 'authorizedStorageAccounts'),
                    },
                },
            },
            configuredResources: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}internal_users/${model.id}/configured_resources`,
                        meta: this.buildRelatedLinkMeta(model, 'configuredResources'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<InternalUserModel>) {
        return {
            self: `${addonServiceAPIUrl}internal_users/${model.id}/`,
        };
    }
}
