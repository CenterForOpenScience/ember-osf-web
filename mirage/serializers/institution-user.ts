import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import InstitutionUser from 'ember-osf-web/models/institution-user';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class InstitutionUsersSerializer extends ApplicationSerializer<InstitutionUser> {
    buildRelationships(model: ModelInstance<InstitutionUser>) {
        return {
            user: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.user.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'user'),
                    },
                },
                data: {
                    id: model.user.id,
                    type: 'users',
                },
            },
        };
    }
}
