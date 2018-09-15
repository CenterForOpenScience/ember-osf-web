import config from 'ember-get-config';
import File from 'ember-osf-web/models/file';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class FileSerializer extends ApplicationSerializer {
    links(model: File & { attrs: any }) {
        const returnValue = {
            user: {
                data: {
                    type: 'users',
                    id: model.user.id,
                },
                related: {
                    href: `${apiUrl}/v2/users/${model.user.id}/`,
                    meta: this.buildRelatedLinkMeta(model, 'user'),
                },
            },
            versions: {
                related: {
                    href: `${apiUrl}/v2/files/${model.id}/versions/`,
                    meta: this.buildRelatedLinkMeta(model, 'versions'),
                },
            },
        };
        return returnValue;
    }
}
