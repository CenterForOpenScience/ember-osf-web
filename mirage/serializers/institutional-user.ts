import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import InstitutionalUser from 'ember-osf-web/models/institutional-user';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class InstitutionalUsersSerializer extends ApplicationSerializer<InstitutionalUser> {
    buildRelationships(model: ModelInstance<InstitutionalUser>) {
        return {
            user: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.user.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'user'),
                    },
                },
            },
        };
    }
}
