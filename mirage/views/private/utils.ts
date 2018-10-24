import { camelize } from '@ember/string';
import { HandlerContext, Request, Schema } from 'ember-cli-mirage';
import { Resource, ResourceCollectionDocument } from 'osf-api';

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

export function sort(request: Request, data: any[], options: ProcessOptions = {}): any[] {
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
    Object.keys(params).sort().forEach(key => {
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

export function paginate(
    request: Request,
    data: Array<unknown>,
    options: ProcessOptions = {},
): ResourceCollectionDocument {
    const total = data.length;
    const { queryParams, url } = request;
    const { defaultPageSize = 10 } = options;
    let start: number = 0;

    const perPage = Number.parseInt(queryParams['page[size]'], 10) || defaultPageSize;
    let currentPage = 1;
    if (typeof queryParams.page !== 'undefined') {
        currentPage = Number.parseInt(queryParams.page, 10);
        start = (currentPage - 1) * perPage;
    }

    const pages = Math.ceil(total / perPage);
    const nextPage = Math.min(currentPage + 1, pages);
    const prevPage = Math.max(currentPage - 1, 1);
    const lastPage = pages;

    let prev = null;
    let next = null;

    const self = `${url}${buildQueryParams(queryParams)}`;
    const first = `${url}${buildQueryParams({ ...queryParams, page: '1' })}`;
    const last = `${url}${buildQueryParams({ ...queryParams, page: lastPage.toString() })}`;
    if (nextPage > currentPage) {
        next = `${url}${buildQueryParams({ ...queryParams, page: nextPage.toString() })}`;
    }
    if (prevPage < currentPage) {
        prev = `${url}${buildQueryParams({ ...queryParams, page: prevPage.toString() })}`;
    }

    const paginatedJson = {
        data: data.slice(start, start + perPage) as Resource[],
        links: {
            self,
            first,
            next,
            prev,
            last,
        },
        meta: {
            version: '',
            total,
            per_page: perPage,
        },
    };
    return paginatedJson;
}

function autoEmbed(embedItem: any, serializedData: {}, handlerContext: HandlerContext) {
    const data = Object.assign(serializedData);
    data.embeds = {};
    if (embedItem.modelName in alwaysEmbed) { // If this kind of thing has auto-embeds
        // Go through each of the alwaysEmbed strings for this kind of object
        for (const aeRelationship of alwaysEmbed[embedItem.modelName]) {
            if (embedItem.fks.includes(`${aeRelationship}Id`)) { // is it in fks?
                // If so, embed it
                const aEmbeddable = handlerContext.serialize(embedItem[aeRelationship]);
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

export function embed(
    schema: Schema,
    request: Request,
    json: ResourceCollectionDocument,
    handlerContext: HandlerContext,
) {
    return {
        ...json,
        data: json.data.map(datum => {
            const embeds = ([] as string[])
                .concat(request.queryParams.embed)
                .filter(Boolean)
                .reduce((acc, embedRequest) => {
                    const embeddable = schema[camelize(datum.type)].find(datum.id)[camelize(embedRequest)] as any;

                    if (embeddable !== null && embeddable !== undefined) {
                        if ('models' in embeddable) {
                            let paginatedEmbeddables: ResourceCollectionDocument = {
                                data: [],
                                links: {},
                                meta: { version: '', total: 0, per_page: 10 },
                            };
                            if (Array.isArray(embeddable.models)) {
                                paginatedEmbeddables = paginate(request, embeddable.models, {});
                                paginatedEmbeddables.data = paginatedEmbeddables.data.map((embedItem: any) =>
                                    autoEmbed(embedItem, handlerContext.serialize(embedItem).data, handlerContext));
                            }
                            return { ...acc, [embedRequest]: paginatedEmbeddables };
                        }
                        return {
                            ...acc,
                            [embedRequest]: {
                                data: autoEmbed(embeddable, handlerContext.serialize(embeddable).data, handlerContext),
                            },
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
