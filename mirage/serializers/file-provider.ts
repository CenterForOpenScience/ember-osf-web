import { underscore } from '@ember/string';
import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import { MirageFileProvider } from '../factories/file-provider';

import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class FileSerializer extends ApplicationSerializer<MirageFileProvider> {
    buildRelationships(model: ModelInstance<MirageFileProvider>) {
        const relationships: SerializedRelationships<MirageFileProvider> = {};
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
        return relationships;
    }

    buildNormalLinks(model: ModelInstance<MirageFileProvider>) {
        const pathName = underscore(model.targetId.type);
        return {
            ...super.buildNormalLinks(model),
            upload: `${apiUrl}/v2/${pathName}/${model.targetId.id}/files/${model.name}/upload`,
        };
    }
}
