import { helper } from '@ember/component/helper';

/**
 * numberFormat helper.
 *
 * @class filterReplace
 * @param {Integer} number
 * @return {String} Returns string with language sensitive representation of the number
 */
export function numberFormat(params: any[]/* , hash */) {
    const [num] = params;

    return (num as number).toLocaleString();
}

export default helper(numberFormat);
