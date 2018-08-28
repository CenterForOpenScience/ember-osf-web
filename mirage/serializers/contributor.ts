import config from 'ember-get-config';
import Contributor from 'ember-osf-web/models/contributor';
import ApplicationSerializer, { SerializedLinks } from './application';

const { OSF: { apiUrl } } = config;

export default class ContributorSerializer extends ApplicationSerializer {
    links(model: Contributor): SerializedLinks<Contributor> {
        return {
            users: {
                related: {
                    href: `${apiUrl}/v2/users/${model.users.id}/`,
                    meta: this.buildRelatedLinkMeta(model, 'users'),
                },
            },
            node: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.node.id}`,
                    meta: this.buildRelatedLinkMeta(model, 'node'),
                },
            },
        };
    }
}
