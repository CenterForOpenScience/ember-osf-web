import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import { pluralize } from 'ember-inflector';

import Guid from 'ember-osf-web/models/guid';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

type SerializedGuid = Guid & { referent: ModelInstance };

export default class GuidSerializer extends ApplicationSerializer<SerializedGuid> {
    attrs = [];

    buildRelationships(guid: ModelInstance<SerializedGuid>) {
        const pluralizedType = pluralize(guid.referentType!);
        const referent = guid._schema[pluralizedType].find(guid.id);
        const typeKey = this.typeKeyForModel(referent);
        return {
            referent: {
                data: {
                    id: referent.id,
                    type: typeKey,
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/${typeKey}/${referent.id}/`,
                        meta: {
                            type: typeKey,
                        },
                    },
                },
            },
        };
    }
}
