import Model from '@ember-data/model';
import DS from 'ember-data';
import {
    NormalizedRegistrationResponse,
    RegistrationResponse,
} from 'ember-osf-web/packages/registration-schema';
import { mapKeysAndValues } from 'ember-osf-web/utils/map-keys';
import { Resource } from 'osf-api';

import { JsonPayload, normalizeRegistrationResponses, serializeRegistrationResponses } from './draft-registration';
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

    serializeAttribute(snapshot: DS.Snapshot, json: JsonPayload, key: string, attribute: object): void {
        super.serializeAttribute(snapshot, json, key, attribute);

        if (key === 'revisionResponses' && json.attributes) {
            const underscoreKey = this.keyForAttribute(key);
            const revisionResponses = json.attributes[underscoreKey] as NormalizedRegistrationResponse;

            // eslint-disable-next-line no-param-reassign
            json.attributes[underscoreKey] = mapKeysAndValues(
                revisionResponses || {},
                k => k,
                value => serializeRegistrationResponses(value),
            );
        }
    }
}
declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'schema-response': SchemaResponseSerializer;
    } // eslint-disable-line semi
}
