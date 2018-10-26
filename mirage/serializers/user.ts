import { faker, ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import User from 'ember-osf-web/models/user';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class UserSerializer extends ApplicationSerializer<User> {
    buildRelationships(model: ModelInstance<User>) {
        return {
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
            institutions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.id}/institutions/`,
                        meta: this.buildRelatedLinkMeta(model, 'institutions'),
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
