import { faker, ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import User from 'ember-osf-web/models/user';
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
            identities: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.id}/settings/identities/`,
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
                    id: 'us',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/regions/us/`,
                        meta: {},
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<User>) {
        return {
            ...super.buildNormalLinks(model),
            profile_image: `https://www.gravatar.com/avatar/${faker.random.uuid().replace(/-/g, '')}?d=identicon`,
        };
    }
}
