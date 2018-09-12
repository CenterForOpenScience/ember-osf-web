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
        };
    }
}
