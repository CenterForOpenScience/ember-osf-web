import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import ExternalAccountsModel from 'ember-osf-web/models/external-accounts';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class ExternalAccountSerializer extends ApplicationSerializer<ExternalAccountsModel> {
    buildNormalLinks(model: ModelInstance<ExternalAccountsModel>) {
        return {
            self: `${apiUrl}/v2/users/me/addons/${model.provider}/accounts/${model.id}`,
        };
    }
}
