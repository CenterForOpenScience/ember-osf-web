import Ember from 'ember';

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
export function ifFilter(params) {
    const [element, filter, intersection] = params;
    if (intersection) {
        const match = element.filter(each => filter.includes(each));
        return match.length;
    }
    if (typeof filter === 'object') {
        return filter.includes(element);
    }
    if (typeof filter === 'undefined' || element.toLowerCase().includes(filter.toLowerCase())) {
        return true;
    }
    return false;
}

export default Ember.Helper.helper(ifFilter);
