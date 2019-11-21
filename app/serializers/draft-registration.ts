import { isEmpty } from '@ember/utils';
import DS from 'ember-data';

import {
    FileReference,
    NormalizedRegistrationResponse,
    NormalizedResponseValue,
    RegistrationResponse,
    ResponseValue,
} from 'ember-osf-web/packages/registration-schema';
import { mapKeysAndValues } from 'ember-osf-web/utils/map-keys';
import { SingleResourceDocument } from 'osf-api';
import OsfSerializer from './osf-serializer';

interface JsonPayload {
    attributes: Record<string, {}>;
}

function normalizeRegistrationResponses(value: ResponseValue, store: DS.Store) {
    if (Array.isArray(value) && !isEmpty(value) && ('file_id' in value.firstObject)) {
        return (value as FileReference[]).map((fileRef: FileReference) => {
            const peekedRecord = store.peekRecord('file', fileRef.file_id);
            if (peekedRecord) {
                return peekedRecord;
            }
            return store.createRecord('file', { id: fileRef.file_id });
        });
    }
    return value;
}

function serializeRegistrationResponses(value: NormalizedResponseValue) {
    if (Array.isArray(value) && !isEmpty(value) && ('materializedPath' in value.firstObject)) {
        return value.map(file => file.isNew ? file : file.toFileReference());
    }
    return value;
}

export default class DraftRegistrationSerializer extends OsfSerializer {
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
            payload.data.attributes.registration_responses = mapKeysAndValues(
                registrationResponses || {},
                key => key,
                value => normalizeRegistrationResponses(value, store),
            ) as NormalizedRegistrationResponse;
        }
        return super.normalizeResponse(store, primaryModelClass, payload, id, requestType);
    }

    serializeAttribute(snapshot: DS.Snapshot, json: JsonPayload, key: string, attribute: object): void {
        super.serializeAttribute(snapshot, json, key, attribute);

        if (key === 'registrationResponses') {
            const underscoreKey = this.keyForAttribute(key);
            const registrationResponses = json.attributes[underscoreKey] as NormalizedRegistrationResponse;

            json.attributes[underscoreKey] = mapKeysAndValues(
                registrationResponses || {},
                k => k,
                value => serializeRegistrationResponses(value),
            );
        }
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'draft-registration': DraftRegistrationSerializer;
    } // eslint-disable-line semi
}
