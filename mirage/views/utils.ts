import { compare, embed, paginate, ProcessOptions, sort, toOperator } from './private/utils';

export const process = (schema: any, request: any, config: {}, data: any[], options: ProcessOptions) => {
    const sorted = sort(request, data, options);
    let paginatedJson: any = paginate(request, sorted, options);
    paginatedJson = embed(schema, request, paginatedJson, config);
    return paginatedJson;
};

export const filter = (model: any, request: any) => {
    const { queryParams } = request;
    const filterRegex = /^filter\[((?:\w+(?:\.\w+)*,?)+)\](?:\[([a-z]+)\])?/;

    return Object.entries(queryParams)
        .filter(([key]) => filterRegex.test(key))
        .every(([key, val]) => {
            const filtered = filterRegex.exec(key);
            if (filtered !== null) {
                const [groups, operator] = filtered.slice(1);
                return groups.split(',').some(group => {
                    const fields = group.split('.');
                    const field = fields.slice(-1)[0];
                    const subModels = fields.slice(0, -1);
                    if (subModels.length > 0) {
                        throw new Error(`We aren't ready for submodels yet, but we got: ${subModels}`);
                        // If this error comes up, that means we need to implement deep filtering on submodels.
                        // For example, filter[contributors.users.full_name]=meit will need to go to the
                        // contributor's user and compare that user's full_name with the string 'meit'.
                    }
                    return compare(model[field], val, toOperator(operator));
                });
            } else {
                return true;
            }
        });
};
