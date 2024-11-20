export function *iterOsfmapObjects(osfmapObject: any, propertyPath: string[]): IterableIterator<any> {
    const [property, ...remainingPath] = propertyPath;
    const innerObjArray = osfmapObject[property] || [];
    if (remainingPath.length) {
        for (const innerObj of innerObjArray) {
            yield* iterOsfmapObjects(innerObj, remainingPath);
        }
    } else {
        yield* innerObjArray;
    }
}

export function *iterOsfmapValues(osfmapObject: any, propertyPath: string[]): IterableIterator<any> {
    for (const obj of iterOsfmapObjects(osfmapObject, propertyPath)) {
        yield (Object.hasOwn(obj, '@id') ? obj['@id'] : obj['@value']);
    }
}

export function getOsfmapValues(osfmapObject: any, propertyPath: string[]) {
    return Array.from(iterOsfmapValues(osfmapObject, propertyPath));
}

export function getSingleOsfmapValue(osfmapObject: any, propertyPath: string[]) {
    return iterOsfmapValues(osfmapObject, propertyPath).next().value;
}

export function getOsfmapObjects(osfmapObject: any, propertyPath: string[]) {
    return Array.from(iterOsfmapObjects(osfmapObject, propertyPath));
}

export function getSingleOsfmapObject(osfmapObject: any, propertyPath: string[]) {
    return iterOsfmapObjects(osfmapObject, propertyPath).next().value;
}

export function hasOsfmapValue(osfmapObject: any, propertyPath: string[], expectedValue: any) {
    return Array.from(iterOsfmapValues(osfmapObject, propertyPath)).some(value => value === expectedValue);
}
