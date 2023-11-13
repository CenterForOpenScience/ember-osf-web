import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import UserAddonModel from 'ember-osf-web/models/user-addon';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class UserAddonSerializer extends ApplicationSerializer<UserAddonModel> {
    buildRelationships(model: ModelInstance<UserAddonModel>) {
        return {
            user: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.user.id}`,
                        meta: this.buildRelatedLinkMeta(model, 'user'),
                    },
                },
            },
            externalAccounts: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.user.id}/addons/${model.id}/accounts/`,
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<UserAddonModel>) {
        return {
            self: `${apiUrl}/v2/users/${model.user.id}/addons/${model.id}`,
        };
    }
}
