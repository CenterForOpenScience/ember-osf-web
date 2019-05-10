import { camelize, underscore } from '@ember/string';

export function mapKeysAndValues<Value, NewValue>(
    obj: Record<string, Value>,
    mapKey: (k: string) => string,
    mapValue: (v: Value) => NewValue,
): object {
    return Object.entries(obj).reduce(
        (acc, [k, v]) => {
            const mappedKey = mapKey(k);
            if (Object.prototype.hasOwnProperty.call(acc, mappedKey)) {
                throw Error(`Mapping keys causes duplicate key: "${mappedKey}"`);
            }
            return {
                ...acc,
                [mappedKey]: mapValue(v),
            };
        },
        {} as Record<string, NewValue>,
    );
}

export function camelizeKeys(obj: Record<string, unknown>) {
    return mapKeysAndValues(
        obj,
        key => camelize(key),
        value => value,
    );
}

export function snakifyKeys(obj: Record<string, unknown>) {
    return mapKeysAndValues(
        obj,
        key => underscore(key),
        value => value,
    );
}
