import DS from 'ember-data';
import config from 'ember-get-config';
import { Resource } from 'osf-api';
import OsfSerializer from './osf-serializer';

const {
    OSF: {
        apiUrl,
        apiNamespace,
    },
} = config;

export default class UserSerializer extends OsfSerializer {
    normalize(modelClass: DS.Model, resourceHash: Resource) {
        const result = super.normalize(modelClass, resourceHash);
        // Manually insert a `sparseNodes` relationship to the model because the API doesn't serialize this relationship
        result.data.relationships!.sparseNodes = {
            links: {
                related: {
                    href: `${apiUrl}/${apiNamespace}/sparse/users/${resourceHash.id}/nodes`,
                },
            },
        };
        return result;
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        user: UserSerializer;
    } // eslint-disable-line semi
}
