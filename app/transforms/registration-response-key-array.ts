import Transform from '@ember-data/serializer/transform';
import { deserializeResponseKey, serializeResponseKey } from './registration-response-key';

export default class RegistrationResponseKeyArrayTransform extends Transform {
    deserialize(values: string[] | null): string[] {
        if (values === null) {
            return [];
        }
        return values.map(
            value => deserializeResponseKey(value),
        );
    }

    serialize(values: string[] | null): string[] {
        if (values === null) {
            return [];
        }
        return values.map(
            value => serializeResponseKey(value),
        );
    }
}


declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        'registration-response-key-array': {};
    } // eslint-disable-line semi
}
