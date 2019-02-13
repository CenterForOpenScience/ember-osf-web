import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import UserAddon from 'ember-osf-web/models/user-addon';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class UserAddonSerializer extends ApplicationSerializer<UserAddon> {
    buildRelationships(model: ModelInstance<UserAddon>) {
        return {
            accounts: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.user.id}/addons/${model.id}/accounts/`,
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<UserAddon>) {
        return {
            self: `${apiUrl}/v2/users/${model.user.id}/addons/`,
        };
    }
}
