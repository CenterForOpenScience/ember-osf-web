import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Identity from 'ember-osf-web/models/identity';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class IdentitySerializer extends ApplicationSerializer<Identity> {
    buildNormalLinks(model: ModelInstance<Identity>) {
        return {
            self: `${apiUrl}/v2/users/${model.user.id}/settings/identities/${model.id}`,
        };
    }
}
