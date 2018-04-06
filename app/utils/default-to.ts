export default function defaultTo<T, TDefault>(value: T, defaultValue: TDefault) {
    return (typeof value === 'undefined' ? defaultValue : value) as T extends undefined ? TDefault : T;
}
