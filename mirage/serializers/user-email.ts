import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

// import { SingleResourceDocument } from 'osf-api';

import UserEmail from 'ember-osf-web/models/user-email';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class UserEmailSerializer extends ApplicationSerializer<UserEmail> {
    buildNormalLinks(model: ModelInstance<UserEmail>) {
        return {
            self: `${apiUrl}/v2/users/${model.user.id}/settings/emails/${model.id}`,
        };
    }
}
