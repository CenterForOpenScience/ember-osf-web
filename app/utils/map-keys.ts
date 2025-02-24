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

export function camelizeKeys<K extends string>(obj: Partial<Record<K, unknown>>, recursive = false): any {
    return mapKeysAndValues(
        obj,
        key => camelize(key),
        value => recursive ? _recurseKeys(value, camelizeKeys) : value,
    );
}

export function snakifyKeys(obj: Partial<Record<string, unknown>>, recursive = false): any {
    return mapKeysAndValues(
        obj,
        key => underscore(key),
        value => recursive ? _recurseKeys(value, snakifyKeys) : value,
    );
}

function _recurseKeys(value: any, keyMap: typeof camelizeKeys | typeof snakifyKeys) {
    if (Array.isArray(value)) {
        return value.map(_item => keyMap(_item, true));
    } else if (value !== null && typeof value === 'object') {
        return keyMap(value, true);
    }
    return value;
}
