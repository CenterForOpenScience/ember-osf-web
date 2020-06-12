import moment from 'moment';

/**
 * @module ember-osf
 * @submodule utils
 */

/**
 * @class elastic-query
 */

/**
 * @method dateRangeFilter
 * @param String field Name of the date field to filter
 * @param Object start Beginning of date range
 * @param Object end End of date range
 * @return filter
 */
export function dateRangeFilter(field: string, start: Date | null, end: Date | null) {
    return !(start && end) ? null : {
        range: {
            [field]: {
                gte: moment(start).format(),
                lte: moment(end).format(),
            },
        },
    };
}

const exactFields = ['contributors', 'funders', 'identifiers', 'tags', 'publishers'];

/**
 * @method termsFilter
 * @param String field Name of the field to filter
 * @param Array terms List of terms to match
 * @param Boolean [all] If true (default), return an array of filters to match results with *all* of the terms.
 * Otherwise, return a single filter to match results with *any* of the terms.
 * @return filter
 */
export function termsFilter(fieldName: string, terms: string[] = [], all = true) {
    if (!terms.length) {
        return null;
    }

    const field = exactFields.includes(fieldName) ? `${fieldName}.exact` : fieldName;

    return all
        ? terms.map((term: string) => ({
            term: {
                // creative work filter should not include subtypes
                [term === 'creative work' && field === 'types' ? 'type' : field]: term,
            },
        }))
        : {
            terms: {
                [field]: terms,
            },
        };
}

export function getUniqueList<T>(data: T[]) {
    return [...new Set(data)];
}

export function encodeParams(tags: string[]) {
    return tags.map(tag => tag.replace(/,/g, ',\\'));
}

export function decodeParams(param: string) {
    return param.split(/,(?!\\)/).map(tag => tag.replace(/,\\/g, ','));
}

export function getSplitParams(params: any) {
    if (!params.length) {
        return params.slice(0);
    }
    if (params.length && Array.isArray(params[0])) {
        return params[0];
    }
    if (params.length && typeof (params) === 'string') {
        return decodeParams(params);
    }
    if (params.length === 1) {
        return decodeParams(params[0]);
    }

    return params;
}
