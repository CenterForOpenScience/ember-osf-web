import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import FileProviderModel from 'ember-osf-web/models/file-provider';

import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl } } = config;

export default class FileSerializer extends ApplicationSerializer<FileProviderModel> {
    buildRelationships(model: ModelInstance<FileProviderModel>) {
        const relationships: SerializedRelationships<FileProviderModel> = {};
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

    buildNormalLinks(model: ModelInstance<FileProviderModel>) {
        let uploadUrl;
        if (model.draftNode) {
            uploadUrl = `${apiUrl}/v2/draft_nodes/${model.draftNode.id}/files/${model.name}/upload`;
        } else {
            uploadUrl = `${apiUrl}/v2/nodes/${model.node.id}/files/${model.name}/upload`;
        }

        return {
            ...super.buildNormalLinks(model),
            upload: uploadUrl,
        };
    }
}
