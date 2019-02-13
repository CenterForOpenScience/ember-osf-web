import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import AccountModel from 'ember-osf-web/models/account';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class AccountSerializer extends ApplicationSerializer<AccountModel> {
    buildNormalLinks(model: ModelInstance<AccountModel>) {
        const { addon } = model;

        return {
            self: `${apiUrl}/v2/users/${addon.user.id}/addons/${addon.id}/accounts/`,
        };
    }
}
