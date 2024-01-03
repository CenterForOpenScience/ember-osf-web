import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import ExternalAccountsModel from 'ember-osf-web/models/external-account';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class ExternalAccountSerializer extends ApplicationSerializer<ExternalAccountsModel> {
    buildNormalLinks(model: ModelInstance<ExternalAccountsModel>) {
        return {
            self: `${apiUrl}/v2/users/me/addons/${model.provider.id}/accounts/${model.id}`,
        };
    }

    buildRelationships(model: ModelInstance<ExternalAccountsModel>) {
        return {
            provider: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/addons/${model.provider.id}`,
                    },
                },
            },
        };
    }
}
