import DS from 'ember-data';
import { mapKeysAndValues } from 'ember-osf-web/utils/map-keys';

import fixSpecialChars from 'ember-osf-web/utils/fix-special-char';
import { deserializeResponseKey, serializeResponseKey } from './registration-response-key';

const { Transform } = DS;

function isResponse(obj: unknown): obj is Record<string, unknown> {
    return typeof obj === 'object' && obj !== null && Object.keys(obj).every(key => typeof key === 'string');
}

export default class RegistrationResponsesTransform extends Transform {
    deserialize(obj: unknown) {
        if (!isResponse(obj)) {
            return {};
        }
        return mapKeysAndValues(
            obj,
            key => deserializeResponseKey(key),
            value => fixSpecialChars(value as string),
        );
    }

    serialize(obj: any) {
        return mapKeysAndValues(
            obj,
            key => serializeResponseKey(key),
            value => value,
        );
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        'registration-responses': {};
    } // eslint-disable-line semi
}
