import DS from 'ember-data';
import { mapKeysAndValues } from 'ember-osf-web/utils/map-keys';

import { deserializeResponseKey, serializeResponseKey } from './registration-response-key';

const { Transform } = DS;

export default class RegistrationResponsesTransform extends Transform {
    deserialize(obj: any) {
        return mapKeysAndValues(
            obj,
            key => deserializeResponseKey(key),
            value => value,
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
