import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';

import Guid from 'ember-osf-web/models/guid';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

type SerializedGuid = Guid & { referent: ModelInstance };

export default class GuidSerializer extends ApplicationSerializer<SerializedGuid> {
    buildRelationships(guid: ModelInstance<SerializedGuid>) {
        const referent = server.schema[guid.referentType].find(guid.id);
        const referentType = this.typeKeyForModel(referent);
        return {
            referent: {
                data: {
                    id: referent.id,
                    type: referentType,
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/${referentType}/${referent.id}/`,
                        meta: {
                            type: referentType,
                        },
                    },
                },
            },
        };
    }
}
