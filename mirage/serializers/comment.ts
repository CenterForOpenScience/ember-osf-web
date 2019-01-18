import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Comment from 'ember-osf-web/models/comment';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class ContributorSerializer extends ApplicationSerializer<Comment> {
    buildRelationships(model: ModelInstance<Comment>) {
        return {
            user: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.user.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'user'),
                    },
                },
            },
            node: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.node.id}`,
                        meta: this.buildRelatedLinkMeta(model, 'node'),
                    },
                },
            },
            replies: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.node.id}/comments/?filter[targetID]=${model.id}`,
                        meta: {},
                    },
                },
            },
            reports: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/comments/${model.id}/reports/`,
                    },
                },
            },
        };
    }
}
