import { camelize } from '@ember/string';
import { ModelInstance, Request } from 'ember-cli-mirage';
import { DataDocument, Resource, ResourceCollectionDocument } from 'osf-api';

import { queryParamIsTruthy, ViewContext } from './index';

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
    contributors: ['users'],
};

interface WithAttributes {
    attributes: { [index: string]: any };
}

// https://stackoverflow.com/a/4760279
export function dynamicSort(property: string) {
    let sortOrder = 1;
    let newProp = property;
    if (newProp[0] === '-') {
        sortOrder = -1;
        newProp = newProp.substr(1);
    }
    return (a: WithAttributes, b: WithAttributes) => {
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

export function sort(request: Request, data: unknown[], options: ProcessOptions = {}): unknown[] {
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
    }
    return '';
}

export function paginate(
    request: Request,
    data: unknown[],
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

function serializeWithAutoEmbeds(model: ModelInstance, context: ViewContext): Resource {
    const serialized = context.handlerContext.serialize(model).data;
    // eslint-disable-next-line no-use-before-define
    return withEmbeds(serialized, alwaysEmbed[serialized.type], context);
}

function withEmbeds(serializedDatum: Resource, embedRequests: string[] | undefined, context: ViewContext): Resource {
    if (!embedRequests || !embedRequests.length) {
        return serializedDatum;
    }

    const datum = context.schema[camelize(serializedDatum.type)].find(serializedDatum.id);
    const embeds = embedRequests.reduce((acc, embedRequest) => {
        const embeddable = datum[camelize(embedRequest)];
        if (!embeddable) {
            return acc;
        }
        let embeddedDocument: DataDocument;
        if ('models' in embeddable) {
            embeddedDocument = paginate(
                context.request,
                embeddable.models.map((model: ModelInstance) => serializeWithAutoEmbeds(model, context)),
            );
        } else {
            embeddedDocument = {
                data: serializeWithAutoEmbeds(embeddable, context),
                meta: {
                    version: '',
                },
            };
        }
        return { ...acc, [embedRequest]: embeddedDocument };
    }, {});

    return { ...serializedDatum, embeds };
}

export function embed(
    json: ResourceCollectionDocument,
    context: ViewContext,
) {
    return {
        ...json,
        data: json.data.map(datum => withEmbeds(
            datum,
            ([] as string[]).concat(
                alwaysEmbed[datum.type],
                context.request.queryParams.embed,
            ).filter(Boolean),
            context,
        )),
    };
}

export function compareStrings(
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

export function compareBooleans(
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

export function compare(
    actualValue: string | boolean,
    comparisonValue: string,
    operator: ComparisonOperators,
): boolean {
    if (typeof actualValue === 'string') {
        return compareStrings(actualValue, comparisonValue, operator);
    } else if (typeof actualValue === 'boolean') {
        return compareBooleans(actualValue, queryParamIsTruthy(comparisonValue), operator);
    }
    throw new Error(`We haven't implemented comparisons with "${operator}" yet.`);
}

export function toOperator(operatorString: string): ComparisonOperators {
    if (!operatorString || operatorString === 'eq') {
        return ComparisonOperators.Eq;
    } else if (Object.values(ComparisonOperators).includes(operatorString)) {
        return operatorString as ComparisonOperators;
    }
    throw new Error(`The operator ${operatorString} is unknown.`);
}
