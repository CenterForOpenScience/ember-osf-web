import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import UserEmail from 'ember-osf-web/models/user-email';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class UserEmailSerializer extends ApplicationSerializer<UserEmail> {
    buildNormalLinks(model: ModelInstance<UserEmail>) {
        let links = {
            self: `${apiUrl}/v2/users/${model.user.id}/settings/emails/${model.id}`,
        };
        if (!model.confirmed) {
            const resendConfirmation = {
                resend_confirmation:
                    `${apiUrl}/v2/users/${model.user.id}/settings/emails/${model.id}?resend_confirmation=true`,
            };
            links = { ...links, ...resendConfirmation };
        }
        return links;
    }
}
