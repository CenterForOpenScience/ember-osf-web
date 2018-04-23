export default function defaultTo<T>(value: T, defaultValue: Exclude<T, undefined>) {
    return typeof value === 'undefined' ? defaultValue : value as Exclude<T, undefined>;
}
