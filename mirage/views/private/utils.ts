import { camelize } from '@ember/string';

export enum ComparisonOperators {
    Eq = 'eq',
    Ne = 'ne',
    Lt = 'lt',
    Lte = 'lte',
    Gt = 'gt',
    Gte = 'gte',
}

export interface ProcessOptions {
    defaultPageSize?: number;
    defaultSortKey?: string;
}

interface QueryParameters {
    [key: string]: string;
}

export interface JsonData {
    data: any[];
    links: {};
    meta: {};
}

// Fields marked always_embed in the osf api code should be added to this constant
// The key is the model and the list contains the relationships to embed.
const alwaysEmbed: { [key: string]: string[] } = {
    contributor: ['users'],
};

// https://stackoverflow.com/a/4760279
export function dynamicSort(property: string) {
    let sortOrder = 1;
    let newProp = property;
    if (newProp[0] === '-') {
        sortOrder = -1;
        newProp = newProp.substr(1);
    }
    return (a: any, b: any) => {
        let aAt = a.attributes;
        let bAt = b.attributes;
        if (newProp === 'id') {
            aAt = a;
            bAt = b;
        }
        // eslint-disable-next-line no-nested-ternary
        const result = (aAt[newProp] < bAt[newProp]) ? -1 : (aAt[newProp] > bAt[newProp]) ? 1 : 0;
        return result * sortOrder;
    };
}

export function sort(request: any, data: any[], options: ProcessOptions = {}): any[] {
    const { queryParams } = request;
    const { defaultSortKey = 'date_modified' } = options;
    let sortKey: string = defaultSortKey;
    if (typeof queryParams === 'object' && 'sort' in queryParams) {
        sortKey = queryParams.sort;
    }
    return data.sort(dynamicSort(sortKey));
}

export function buildQueryParams(params: QueryParameters): string {
    let paramString = '?';
    Object.keys(params).forEach(key => {
        if (paramString.length > 1) {
            paramString = `${paramString}&`;
        }
        let encodedValue = params[key];
        if (encodedValue !== null) {
            encodedValue = encodeURIComponent(encodedValue);
        }
        paramString = `${paramString}${key}=${encodedValue}`;
    });
    if (paramString.length > 1) {
        return paramString;
    } else {
        return '';
    }
}

export function paginate(request: any, data: any[], options: ProcessOptions = {}): JsonData {
    const total = data.length;
    const { queryParams, url } = request;
    const self = `${url}${buildQueryParams(queryParams)}`;
    let start: number = 0;
    let { defaultPageSize } = options;
    if (defaultPageSize === undefined) {
        defaultPageSize = 10;
    }
    let perPage = defaultPageSize;
    let currentPage = 1;
    if (typeof queryParams === 'object') {
        if ('page[size]' in queryParams && queryParams['page[size]'] !== 0) {
            perPage = queryParams['page[size]'];
        }
        if ('page' in queryParams) {
            currentPage = queryParams.page;
            start = (currentPage - 1) * perPage;
        }
    }
    const pages = Math.ceil(total / perPage);
    const nextPage = Math.min(currentPage + 1, pages);
    const prevPage = Math.max(currentPage - 1, 1);
    const lastPage = pages;

    let prev = null;
    let next = null;

    queryParams.page = 1;
    const first = `${url}${buildQueryParams(queryParams)}`;
    queryParams.page = lastPage;
    const last = `${url}${buildQueryParams(queryParams)}`;
    if (nextPage > currentPage) {
        queryParams.page = nextPage;
        next = `${url}${buildQueryParams(queryParams)}`;
    }
    if (prevPage < currentPage) {
        queryParams.page = prevPage;
        prev = `${url}${buildQueryParams(queryParams)}`;
    }

    const paginatedJson = {
        data: data.slice(start, start + perPage),
        links: {
            self,
            first,
            next,
            prev,
            last,
        },
        meta: {
            total,
            per_page: perPage,
        },
    };
    return paginatedJson;
}

function autoEmbed(embedItem: any, serializedData: {}, config: any) {
    const data = Object.assign(serializedData);
    data.embeds = {};
    if (embedItem.modelName in alwaysEmbed) { // If this kind of thing has auto-embeds
        // Go through each of the alwaysEmbed strings for this kind of object
        for (const aeRelationship of alwaysEmbed[embedItem.modelName]) {
            if (embedItem.fks.includes(`${aeRelationship}Id`)) { // is it in fks?
                // If so, embed it
                const aEmbeddable = config.serialize(embedItem[aeRelationship]);
                data.embeds[aeRelationship] = {
                    data: aEmbeddable.data,
                };
            }
        }
    }
    if (!Object.keys(data.embeds).length) {
        delete data.embeds;
    }
    return data;
}

export function embed(schema: any, request: any, json: JsonData, config: any) {
    return {
        ...json,
        data: json.data.map(datum => {
            const embeds = [].concat(request.queryParams.embed).filter(Boolean).reduce((acc, embedRequest) => {
                const embeddable = schema[camelize(datum.type)].find(datum.id)[camelize(embedRequest)];
                if (embeddable !== null && embeddable !== undefined) {
                    if ('models' in embeddable) {
                        let paginatedEmbeddables: JsonData = { data: [], links: {}, meta: {} };
                        if (Array.isArray(embeddable.models)) {
                            paginatedEmbeddables = paginate(request, embeddable.models, {});
                            paginatedEmbeddables.data = paginatedEmbeddables.data.map(embedItem =>
                                autoEmbed(embedItem, config.serialize(embedItem).data, config));
                        }
                        return { ...acc, [embedRequest]: paginatedEmbeddables };
                    }
                    return {
                        ...acc,
                        [embedRequest]: { data: autoEmbed(embeddable, config.serialize(embeddable).data, config) },
                    };
                }
                return acc;
            }, {});
            return Object.keys(embeds).length ? { ...datum, embeds } : datum;
        }),
    };
}

export function compareStrings (
    actualValue: string,
    comparisonValue: string,
    operator: ComparisonOperators,
): boolean {
    switch (operator) {
    case ComparisonOperators.Eq:
        return actualValue.includes(comparisonValue);
    case ComparisonOperators.Ne:
        return !actualValue.includes(comparisonValue);
    default:
        throw new Error(`Strings can't be compared with "${operator}".`);
    }
}

export function compareBooleans (
    actualValue: boolean,
    comparisonValue: boolean,
    operator: ComparisonOperators,
): boolean {
    switch (operator) {
    case ComparisonOperators.Eq:
        return actualValue === comparisonValue;
    case ComparisonOperators.Ne:
        return actualValue !== comparisonValue;
    default:
        throw new Error(`Booleans can't be compared with "${operator}".`);
    }
}

export function compare(actualValue: any, comparisonValue: any, operator: ComparisonOperators): boolean {
    if (typeof actualValue === 'string') {
        return compareStrings(actualValue, comparisonValue, operator);
    } else if (typeof actualValue === 'boolean') {
        return compareBooleans(actualValue, comparisonValue, operator);
    } else {
        throw new Error(`We haven't implemented comparisons with "${operator}" yet.`);
    }
}

export function toOperator(operatorString: string): ComparisonOperators {
    if (!operatorString || operatorString === 'eq') {
        return ComparisonOperators.Eq;
    } else if (Object.values(ComparisonOperators).includes(operatorString)) {
        return operatorString as ComparisonOperators;
    }
    throw new Error(`The operator ${operatorString} is unknown.`);
}
