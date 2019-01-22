import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import User from 'ember-osf-web/models/user';

import { randomGravatar } from '../utils';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class UserSerializer extends ApplicationSerializer<User> {
    buildRelationships(model: ModelInstance<User>) {
        return {
            emails: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.id}/settings/emails/`,
                    },
                },
            },
            settings: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.id}/settings/`,
                    },
                },
            },
            institutions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.id}/institutions/`,
                        meta: this.buildRelatedLinkMeta(model, 'institutions'),
                    },
                },
            },
            nodes: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.id}/nodes/`,
                        meta: this.buildRelatedLinkMeta(model, 'nodes'),
                    },
                },
            },
            quickfiles: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.id}/quickfiles/`,
                        meta: this.buildRelatedLinkMeta(model, 'quickfiles'),
                    },
                },
            },
            default_region: {
                data: {
                    type: 'regions',
                    id: `${model.defaultRegion.id}`,
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/regions/${model.defaultRegion.id}/`,
                        meta: {},
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<User>) {
        return {
            ...super.buildNormalLinks(model),
            profile_image: randomGravatar(),
        };
    }
}
