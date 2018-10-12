import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import File from 'ember-osf-web/models/file';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class FileSerializer extends ApplicationSerializer<File> {
    buildRelationships(model: ModelInstance<File>) {
        return {
            user: {
                data: {
                    type: 'users',
                    id: model.user.id,
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.user.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'user'),
                    },
                },
            },
            versions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/files/${model.id}/versions/`,
                        meta: this.buildRelatedLinkMeta(model, 'versions'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<File>) {
        const { id } = model;
        return {
            upload: `${apiUrl}/wb/files/${id}/upload/`,
            download: `${apiUrl}/wb/files/${id}/download/`,
            move: `${apiUrl}/wb/files/${id}/move/`,
            delete: `${apiUrl}/wb/files/${id}/delete/`,
            self: `${apiUrl}/v2/files/${id}/`,
            info: `${apiUrl}/v2/files/${id}/`,
        };
    }
}
