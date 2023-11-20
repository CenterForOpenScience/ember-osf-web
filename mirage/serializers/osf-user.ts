import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import OsfUserModel from 'ember-osf-web/models/osf-user';

import ApplicationSerializer from './application';

const { addonServiceUrl } = config.OSF;

export default class OsfUserSerializer extends ApplicationSerializer<OsfUserModel> {
    buildRelationships(model: ModelInstance<OsfUserModel>) {
        return {
            authorizedStorageAccounts: {
                links: {
                    related: {
                        href: `${addonServiceUrl}/osf_users/${model.id}/authorized_storage_accounts`,
                        meta: this.buildRelatedLinkMeta(model, 'authorizedStorageAccounts'),
                    },
                },
            },
            configuredResources: {
                links: {
                    related: {
                        href: `${addonServiceUrl}/osf_users/${model.id}/configured_resources`,
                        meta: this.buildRelatedLinkMeta(model, 'configuredResources'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<OsfUserModel>) {
        return {
            self: `${addonServiceUrl}/osf_users/${model.id}/`,
        };
    }
}
