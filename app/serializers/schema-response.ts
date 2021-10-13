import Model from '@ember-data/model';
import {
    NormalizedRegistrationResponse,
    RegistrationResponse,
} from 'ember-osf-web/packages/registration-schema';
import { normalizeRegistrationResponses } from 'ember-osf-web/serializers/draft-registration';
import { mapKeysAndValues } from 'ember-osf-web/utils/map-keys';
import { Resource } from 'osf-api';
import OsfSerializer from './osf-serializer';

export default class SchemaResponseSerializer extends OsfSerializer {
    normalize(modelClass: Model, resourceHash: Resource) {
        if (resourceHash.attributes) {
            const revisionResponses = resourceHash.attributes.revision_responses as RegistrationResponse;
            // @ts-ignore: TODO: fix types
            // eslint-disable-next-line no-param-reassign
            resourceHash.attributes.revision_responses = mapKeysAndValues(
                revisionResponses || {},
                key => key,
                value => normalizeRegistrationResponses(value, this.store),
            ) as NormalizedRegistrationResponse;
        }
        return super.normalize(modelClass, resourceHash) as { data: Resource };
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'schema-response': SchemaResponseSerializer;
    } // eslint-disable-line semi
}
