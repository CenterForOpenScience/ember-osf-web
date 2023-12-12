import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';
import FileVersionModel from 'ember-osf-web/models/file-version';

import ApplicationSerializer, { SerializedRelationships } from './application';

const { OSF: { apiUrl} } = config;

export default class FileVersionSerializer extends ApplicationSerializer<FileVersionModel> {
    // eslint-disable-next-line
    buildRelationships(model: ModelInstance<FileVersionModel>) {
        const relationships: SerializedRelationships<FileVersionModel> = {};
        return relationships;
    }

    buildNormalLinks(model: ModelInstance<FileVersionModel>) {
        return {
            ...super.buildNormalLinks(model),
            html: `${apiUrl}/wb/files/${model.id}?version=${model.id}`,
            download: `${apiUrl}/wb/files/${model.id}/download/?version=${model.id}`,
            render: `${apiUrl}/wb/files/${model.id}/render/?version=${model.id}`,
        };
    }
}
