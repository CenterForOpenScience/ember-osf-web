import { helper } from '@ember/component/helper';

/**
 * numberFormat helper.
 *
 * @class filterReplace
 * @param {Integer} number
 * @return {String} Returns string with language sensitive representation of the number
 */
export function numberFormat([n]: [number]): string {
    return n.toLocaleString();
}

export default helper(numberFormat);
