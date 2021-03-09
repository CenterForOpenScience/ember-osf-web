import DS from 'ember-data';
import {
    NormalizedRegistrationResponse,
    RegistrationResponse,
} from 'ember-osf-web/packages/registration-schema';
import { normalizeRegistrationResponses } from 'ember-osf-web/serializers/draft-registration';
import { mapKeysAndValues } from 'ember-osf-web/utils/map-keys';
import { RelationshipWithData, Resource } from 'osf-api';
import OsfSerializer from './osf-serializer';

export default class RegistrationSerializer extends OsfSerializer {
    normalize(modelClass: DS.Model, resourceHash: Resource) {
        if (resourceHash.attributes) {
            const registrationResponses = resourceHash.attributes.registration_responses as RegistrationResponse;
            // @ts-ignore
            // eslint-disable-next-line no-param-reassign
            resourceHash.attributes.registration_responses = mapKeysAndValues(
                registrationResponses || {},
                key => key,
                value => normalizeRegistrationResponses(value, this.store),
            ) as NormalizedRegistrationResponse;
        }
        return super.normalize(modelClass, resourceHash) as { data: Resource };
    }
    serialize(snapshot: DS.Snapshot, options: {}) {
        const serialized = super.serialize(snapshot, options);
        const { data: { relationships } } = serialized;
        if (relationships) {
            const registeredFrom = relationships.registered_from as RelationshipWithData;
            if (registeredFrom && !registeredFrom.data) {
                delete serialized.data!.relationships!.registered_from;
            }
        }
        return serialized;
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        registration: RegistrationSerializer;
    } // eslint-disable-line semi
}
