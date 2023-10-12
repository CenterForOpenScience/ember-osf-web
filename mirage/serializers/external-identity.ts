import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import ExternalIdentity from 'ember-osf-web/models/external-identity';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class ExternalIdentitySerializer extends ApplicationSerializer<ExternalIdentity> {
    buildNormalLinks(model: ModelInstance<ExternalIdentity>) {
        return {
            self: `${apiUrl}/v2/users/me/settings/identities/${model.id}`,
        };
    }
}
