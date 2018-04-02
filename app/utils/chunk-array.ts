export default function chunkArray(arr: any[], limit: number): any[][] {
    const original = arr.slice();
    const result: any[][] = [];

    while (original.length) {
        result.push(original.splice(0, limit));
    }

    return result;
}
