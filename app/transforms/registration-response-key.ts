import Transform from '@ember-data/serializer/transform';
import { assert } from '@ember/debug';

// these are used to solve two issues with ember objects and changesets:
//   - replace `.` with `|`: keys with `.` are interpreted as nested lookups
//   - add a prefix: keys may collide with ember-changeset's properties (e.g. `data`)

export const responseKeyPrefix = '__responseKey_';

export function deserializeResponseKey(key: string): string {
    return `${responseKeyPrefix}${key.replace(/\./g, '|')}`;
}

export function serializeResponseKey(key: string): string {
    assert(
        `serializeResponseKey: expected deserialized key to start with "${responseKeyPrefix}", got "${key}"`,
        key.startsWith(responseKeyPrefix),
    );
    return key.replace(responseKeyPrefix, '').replace(/\|/g, '.');
}

export default class RegistrationResponseKeyTransform extends Transform {
    deserialize(value: unknown): string | null {
        if (typeof value === 'string') {
            return deserializeResponseKey(value);
        }
        return null;
    }

    serialize(value: string | null): string | null {
        if (value) {
            return serializeResponseKey(value);
        }
        return null;
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        'registration-response-key': {};
    } // eslint-disable-line semi
}
