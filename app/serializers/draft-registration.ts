import Model from '@ember-data/model';
import Store from '@ember-data/store';
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
import { Resource } from 'osf-api';
import OsfSerializer from './osf-serializer';

interface JsonPayload {
    attributes: Record<string, {}>;
}

function isObject(value: unknown) {
    return typeof value === 'object' && !isEmpty(value);
}

export function normalizeRegistrationResponses(value: ResponseValue, store: Store) {
    if (Array.isArray(value) && value.length && isObject(value[0])
        && Object.prototype.hasOwnProperty.call(value[0], 'file_id')) {
        return (value as FileReference[]).map((fileRef: FileReference) => {
            const {
                file_name: name, file_id: id,
                file_urls: { html, download },
                file_hashes: { sha256 },
            } = fileRef;
            const peekedRecord = store.peekRecord('file', id);

            if (peekedRecord) {
                return peekedRecord;
            }

            return store.push({
                data: {
                    id,
                    type: 'file',
                    attributes: {
                        name,
                        extra: {
                            hashes: {
                                sha256,
                            },
                        },
                        links: {
                            html,
                            download,
                        },
                    },
                },
            });
        });
    }
    return value;
}

function serializeRegistrationResponses(value: NormalizedResponseValue) {
    if (Array.isArray(value) && value.length && isObject(value[0]) && 'materializedPath' in value[0]) {
        return value.map(file => file.toFileReference());
    }
    return value;
}

export default class DraftRegistrationSerializer extends OsfSerializer {
    normalize(modelClass: Model, resourceHash: Resource) {
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

    serializeAttribute(snapshot: DS.Snapshot, json: JsonPayload, key: string, attribute: object): void {
        super.serializeAttribute(snapshot, json, key, attribute);

        if (key === 'registrationResponses' && json.attributes) {
            const underscoreKey = this.keyForAttribute(key);
            const registrationResponses = json.attributes[underscoreKey] as NormalizedRegistrationResponse;

            // eslint-disable-next-line no-param-reassign
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
