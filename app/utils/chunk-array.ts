export default function chunkArray<T>(arr: T[], limit: number): T[][] {
    const original = arr.slice();
    const result: T[][] = [];

    while (original.length) {
        result.push(original.splice(0, limit));
    }

    return result;
}
