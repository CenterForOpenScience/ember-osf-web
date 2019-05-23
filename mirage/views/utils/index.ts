import { camelize } from '@ember/string';
import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';
import { compare, embed, paginate, ProcessOptions, sort, toOperator } from './-private';

export interface ViewContext {
    handlerContext: HandlerContext;
    request: Request;
    schema: Schema;
}

export function process(
    schema: Schema,
    request: Request,
    handlerContext: HandlerContext,
    data: unknown[],
    options?: ProcessOptions,
) {
    const context = { schema, request, handlerContext };
    return embed(paginate(request, sort(request, data, options), options), context);
}

export function filter(model: ModelInstance, request: Request) {
    const filterRegex = /^filter\[((?:\w+(?:\.\w+)*,?)+)\](?:\[([a-z]+)\])?/;

    return Object.entries(request.queryParams)
        .filter(([key]) => filterRegex.test(key))
        .every(([key, val]) => {
            const filtered = filterRegex.exec(key);
            if (filtered !== null) {
                const [groups, operator] = filtered.slice(1);
                return groups.split(',').some(group => {
                    const fields = group.split('.');
                    const field = camelize(fields.slice(-1)[0]);
                    const subModels = fields.slice(0, -1);
                    if (subModels.length > 0) {
                        throw new Error(`We aren't ready for submodels yet, but we got: ${subModels}`);
                        // If this error comes up, that means we need to implement deep filtering on submodels.
                        // For example, filter[contributors.users.full_name]=meit will need to go to the
                        // contributor's user and compare that user's full_name with the string 'meit'.
                    }
                    return compare(model[field], val, toOperator(operator));
                });
            }
            return true;
        });
}

export function queryParamIsTruthy(value?: string) {
    return Boolean(
        value && ['true', '1'].includes(value.toString().toLowerCase()),
    );
}
