import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Contributor from 'ember-osf-web/models/contributor';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class ContributorSerializer extends ApplicationSerializer<Contributor> {
    buildRelationships(model: ModelInstance<Contributor>) {
        return {
            users: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.users.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'users'),
                    },
                },
            },
            node: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.node.id}`,
                        meta: this.buildRelatedLinkMeta(model, 'node'),
                    },
                },
            },
        };
    }
}
