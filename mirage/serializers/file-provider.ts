import { underscore } from '@ember/string';
import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import { pluralize } from 'ember-inflector';
import { MirageFileProvider } from '../factories/file-provider';

import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class FileSerializer extends ApplicationSerializer<MirageFileProvider> {
    typeKeyForModel(_: any) {
        return 'files';
    }

    buildRelationships(model: ModelInstance<MirageFileProvider>) {
        const relationships: SerializedRelationships<MirageFileProvider> = {};
        const pathName = pluralize(underscore(model.targetId.type));

        relationships.files = {
            links: {
                related: {
                    href:`${apiUrl}/v2/${pathName}/${model.targetId.id}/files/${model.name}/`,
                    meta:{},
                },
            },
        };
        if (model.rootFolder) {
            relationships.rootFolder = {
                data: {
                    id: model.rootFolder.id,
                    type: this.typeKeyForModel(model.rootFolder),
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/files/${model.rootFolder.id}`,
                        meta: {},
                    },
                },
            };
        }
        relationships.target = {
            data: {
                type: pluralize(model.targetId.type),
                id: model.targetId.id as string,
            },
            links: {
                related: {
                    href: `${apiUrl}/v2/${pathName}/${model.targetId.id}/`,
                    meta: {
                        type: pluralize(model.targetId.type),
                    },
                },
            },
        };

        return relationships;
    }

    buildNormalLinks(model: ModelInstance<MirageFileProvider>) {
        const pathName = pluralize(underscore(model.targetId.type));
        return {
            ...super.buildNormalLinks(model),
            upload: `${apiUrl}/v2/${pathName}/${model.targetId.id}/files/${model.name}/upload`,
        };
    }
}
