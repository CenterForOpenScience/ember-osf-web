import { underscore } from '@ember/string';
import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import { pluralize } from 'ember-inflector';
import { MirageFile } from '../factories/file';

import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl, url } } = config;

export default class FileSerializer extends ApplicationSerializer<MirageFile> {
    buildRelationships(model: ModelInstance<MirageFile>) {
        const returnValue: SerializedRelationships<MirageFile> = {
            versions: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/files/${model.id}/versions/`,
                        meta: this.buildRelatedLinkMeta(model, 'versions'),
                    },
                },
            },
        };

        if (model.targetId && model.targetId.id) {
            const pathName = pluralize(underscore(model.targetId.type));
            if (model.kind === 'folder') {
                returnValue.files = {
                    links: {
                        related: {
                            href: `${apiUrl}/v2/${pathName}/${model.targetId.id}/files/${model.provider}/${model.id}`,
                            meta: this.buildRelatedLinkMeta(model, 'files'),
                        },
                    },
                };
            }
            returnValue.target = {
                data: {
                    type: model.targetId.type,
                    id: model.targetId.id as string,
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/${pathName}/${model.targetId.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'target'),
                    },
                },
            };
        }

        if (model.parentFolder !== null) {
            returnValue.parentFolder = {
                data: {
                    type: 'files',
                    id: model.parentFolder.id,
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/files/${model.parentFolder.id}`,
                    },
                },
            };
        }

        return returnValue;
    }

    buildNormalLinks(model: ModelInstance<MirageFile>) {
        const { id } = model;
        return {
            ...super.buildNormalLinks(model),
            upload: `${apiUrl}/wb/files/${id}/upload/`,
            download: `${apiUrl}/wb/files/${id}/download/`,
            move: `${apiUrl}/wb/files/${id}/move/`,
            delete: `${apiUrl}/wb/files/${id}/delete/`,
            info: `${apiUrl}/v2/files/${id}/`,
            html: `${url}files/osfstorage/${id}/`,
        };
    }
}
