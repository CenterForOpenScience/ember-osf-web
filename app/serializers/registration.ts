import DS from 'ember-data';

import {
    NormalizedRegistrationResponse,
    RegistrationResponse,
} from 'ember-osf-web/packages/registration-schema';
import { normalizeRegistrationResponses } from 'ember-osf-web/serializers/draft-registration';
import { mapKeysAndValues } from 'ember-osf-web/utils/map-keys';
import { SingleResourceDocument } from 'osf-api';
import OsfSerializer from './osf-serializer';

export default class RegistrationSerializer extends OsfSerializer {
    normalizeResponse(
        store: DS.Store,
        primaryModelClass: any,
        payload: SingleResourceDocument,
        id: string,
        requestType: string,
    ) {
        if (payload.data.attributes) {
            const registrationResponses = payload.data.attributes.registration_responses as RegistrationResponse;
            // @ts-ignore
            // eslint-disable-next-line no-param-reassign
            payload.data.attributes.registration_responses = mapKeysAndValues(
                registrationResponses || {},
                key => key,
                value => normalizeRegistrationResponses(value, store),
            ) as NormalizedRegistrationResponse;
        }
        return super.normalizeResponse(store, primaryModelClass, payload, id, requestType);
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        registration: RegistrationSerializer;
    } // eslint-disable-line semi
}
