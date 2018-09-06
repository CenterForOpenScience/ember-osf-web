import { helper } from '@ember/component/helper';

// Adapted from Ember-preprints.
const defaultFilters = {
    'Open Science Framework': 'OSF',
    'Cognitive Sciences ePrint Archive': 'Cogprints',
    OSF: 'OSF',
    'Research Papers in Economics': 'RePEc',
};

/**
 * filterReplace helper. Replaces long provider names without messing with search filter logic
 *
 * @class filterReplace
 * @param {String} filter Filter
 * @param {Object} filters Specific filters list for service
 * @return {String} Return shortened provider filter, if present in filters.
 * Otherwise, return original filter.
 */
export function filterReplace([key, filters = defaultFilters]: [string, { [key: string]: string }]): string {
    return filters[key] || key;
}

export default helper(filterReplace);
