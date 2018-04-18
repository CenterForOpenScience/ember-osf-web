export default function toArray<T>(val: T[] | T): T[] {
    return Array.isArray(val) ? val : [val];
}
