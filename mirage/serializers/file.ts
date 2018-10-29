import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import File from 'ember-osf-web/models/file';

import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class FileSerializer extends ApplicationSerializer<File> {
    buildRelationships(model: ModelInstance<File>) {
        const returnValue: SerializedRelationships<File> = {
            versions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/files/${model.id}/versions/`,
                        meta: this.buildRelatedLinkMeta(model, 'versions'),
                    },
                },
            },
        };
        if (model.user !== null) {
            returnValue.user = {
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
            };
        }
        if (model.node !== null) {
            returnValue.node = {
                data: {
                    type: 'nodes',
                    id: model.node.id,
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.node.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'node'),
                    },
                },
            };
        }
        return returnValue;
    }

    buildNormalLinks(model: ModelInstance<File>) {
        const { id } = model;
        return {
            ...super.buildNormalLinks(model),
            upload: `${apiUrl}/wb/files/${id}/upload/`,
            download: `${apiUrl}/wb/files/${id}/download/`,
            move: `${apiUrl}/wb/files/${id}/move/`,
            delete: `${apiUrl}/wb/files/${id}/delete/`,
            info: `${apiUrl}/v2/files/${id}/`,
        };
    }
}
