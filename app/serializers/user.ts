import DS from 'ember-data';
import { Resource } from 'osf-api';
import OsfSerializer from './osf-serializer';

export default class UserSerializer extends OsfSerializer {
    normalize(modelClass: DS.Model, resourceHash: Resource) {
        const result = super.normalize(modelClass, resourceHash);
        // Manually insert a `sparseNodes` relationship to the model because the API doesn't serialize this relationship
        result.data.relationships!.sparseNodes = {
            links: {
                related: {
                    href: `http://localhost:8000/v2/sparse/users/${resourceHash.id}/nodes`,
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
