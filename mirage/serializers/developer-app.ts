import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import DeveloperApp from 'ember-osf-web/models/developer-app';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class FileSerializer extends ApplicationSerializer {
    typeKeyForModel(_: ModelInstance<DeveloperApp>) {
        return 'applications';
    }

    buildNormalLinks(model: ModelInstance<DeveloperApp>) {
        return {
            ...super.buildNormalLinks(model),
            reset: `${apiUrl}/v2/applications/${model.id}/reset`,
        };
    }
}
