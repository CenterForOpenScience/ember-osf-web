import DS from 'ember-data';
import { mapKeysAndValues } from 'ember-osf-web/utils/map-keys';

const { Transform } = DS;

export default class RegistrationResponsesTransform extends Transform {
    deserialize(obj: any) {
        return mapKeysAndValues(
            obj,
            key => key.replace(/\./g, '|'),
            value => value,
        );
    }

    serialize(obj: any) {
        return mapKeysAndValues(
            obj,
            key => key.replace(/\|/g, '.'),
            value => value,
        );
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        'registration-responses': {};
    } // eslint-disable-line semi
}
