import { compare, embed, paginate, ProcessOptions, sort, toOperator } from './private/utils';

export const process = (schema: any, request: any, config: {}, data: any[], options: ProcessOptions) => {
    const sorted = sort(request, data, options);
    let paginatedJson: any = paginate(request, sorted, options);
    paginatedJson = embed(schema, request, paginatedJson, config);
    return paginatedJson;
};

export const filter = (model: any, request: any) => {
    const { queryParams } = request;
    let results = true;
    const andResults = [true];
    if (typeof queryParams === 'object') {
        for (const key of Object.keys(queryParams)) {
            const comparisonValue = queryParams[key];
            const fieldRegex = /filter\[([a-zA-Z.]+)\]?/;
            const operatorRegex = /filter\[[a-zA-Z.]+\]\[?([a-zA-Z.]+)?\]?/;
            const orResults = [false];
            if (fieldRegex.test(key)) {
                const fieldResults = fieldRegex.exec(key);
                if (fieldResults !== null) {
                    const orGroups = fieldResults[1].split(',');
                    for (const group of orGroups) {
                        const fields = group.split('.');
                        const field = fields[-1];
                        const subModels = fields.slice(0, -1);
                        if (subModels.length > 0) {
                            throw new Error(`We aren't ready for submodels yet, but we got: ${subModels}`);
                            // If this error comes up, that means we need to implement deep filtering on submodels.
                            // For example, filter[contributors.users.full_name]=meit will need to go to the
                            // contributor's user and compare that user's full_name with the string 'meit'.
                        }
                        const operatorResults = operatorRegex.exec(key);
                        let operatorString: string = '';
                        if (operatorResults !== null) {
                            operatorString = operatorResults[1]; // eslint-disable-line prefer-destructuring
                        }
                        const operator = toOperator(operatorString);
                        orResults.push(compare(model[field], comparisonValue, operator));
                    }
                    andResults.push(orResults.some((item: boolean) => item));
                }
            }
        }
        results = andResults.every((item: boolean) => item);
    }
    return results;
};
