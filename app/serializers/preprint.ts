import Model from '@ember-data/model';
import { Resource } from 'osf-api';

import OsfSerializer from './osf-serializer';

export default class PreprintSerializer extends OsfSerializer {
    normalize(modelClass: Model, resourceHash: Resource) {
        const result = super.normalize(modelClass, resourceHash);
        // Insert a `versions` relationship to the model
        result.data.relationships!.versions = {
            links: {
                related: resourceHash.links!.preprint_versions!,
            },
        };
        return result;
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        preprint: PreprintSerializer;
    } // eslint-disable-line semi
}
