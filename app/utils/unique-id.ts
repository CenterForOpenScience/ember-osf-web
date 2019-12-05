export default function uniqueId(prefixes: unknown[]): string {
    return [
        ...prefixes,
        Math.random().toString().replace('.', ''),
    ].join('-');
}
