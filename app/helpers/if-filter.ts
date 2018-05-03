import { helper } from '@ember/component/helper';

/**
 * @module ember-osf-web
 * @submodule helpers
 */

/**
 * ifFilter helper. To be used within an {#if} block, to only display an item if it matches a filter.
 *
 * @class ifFilter
 * @param {String} element
 * @param {Object} filter
 * @param {String} list intersection ??
 * @return {Boolean} Return if matches a filter.
 */
export function ifFilter([element, filter, intersection]: [any, any, any]): boolean {
    if (intersection) {
        const match = element.filter((each: any) => filter.includes(each));
        return !!match.length;
    }

    if (typeof filter === 'object') {
        return filter.includes(element);
    }

    return typeof filter === 'undefined' || element.toLowerCase().includes(filter.toLowerCase());
}

export default helper(ifFilter);
