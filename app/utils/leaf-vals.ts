/*
 * Get values of all leaves in an object tree.
 */
export default function leafVals(obj: object): any[] {
    return Object.values(obj).reduce(
        (acc: any[], val: any) => acc.concat(typeof val === 'object' ? leafVals(val) : val),
        [],
    );
}
