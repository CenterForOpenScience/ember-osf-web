import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import InternalUserModel from 'ember-osf-web/models/internal-user';

import ApplicationSerializer from './application';

const { addonServiceUrl } = config.OSF;

export default class InternalUserSerializer extends ApplicationSerializer<InternalUserModel> {
    buildRelationships(model: ModelInstance<InternalUserModel>) {
        return {
            authorizedStorageAccounts: {
                links: {
                    related: {
                        href: `${addonServiceUrl}/internal_users/${model.id}/authorized_storage_accounts`,
                        meta: this.buildRelatedLinkMeta(model, 'authorizedStorageAccounts'),
                    },
                },
            },
            configuredResources: {
                links: {
                    related: {
                        href: `${addonServiceUrl}/internal_users/${model.id}/configured_resources`,
                        meta: this.buildRelatedLinkMeta(model, 'configuredResources'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<InternalUserModel>) {
        return {
            self: `${addonServiceUrl}/internal_users/${model.id}/`,
        };
    }
}
