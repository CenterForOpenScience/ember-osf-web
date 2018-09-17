import { faker, ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import User from 'ember-osf-web/models/user';
import ApplicationSerializer, { SerializedLinks } from './application';

const { OSF: { apiUrl } } = config;

export default class UserSerializer extends ApplicationSerializer {
    links(model: User): SerializedLinks<User> {
        return {
            nodes: {
                related: {
                    href: `${apiUrl}/v2/users/${model.id}/nodes/`,
                    meta: this.buildRelatedLinkMeta(model, 'nodes'),
                },
            },
            quickfiles: {
                related: {
                    href: `${apiUrl}/v2/users/${model.id}/quickfiles/`,
                    meta: this.buildRelatedLinkMeta(model, 'quickfiles'),
                },
            },
            institutions: {
                related: {
                    href: `${apiUrl}/v2/users/${model.id}/institutions/`,
                    meta: this.buildRelatedLinkMeta(model, 'institutions'),
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<User>) {
        return {
            self: `${apiUrl}/v2/users/${model.id}/`,
            profile_image: `https://www.gravatar.com/avatar/${faker.random.uuid().replace(/-/g, '')}?d=identicon`,
        };
    }
}
