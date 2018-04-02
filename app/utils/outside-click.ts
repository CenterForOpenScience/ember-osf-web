import $ from 'jquery';

/**
 * Dismisses popovers on outside click
 * @class outside-click
 */

/**
 *
 * @method outsideClick
 * @param {Function} clickFunction
 */
export default function outsideClick(clickFunction) {
    $('body').on('click', (e: MouseEvent) => {
        const { target } = e;
        const targetClass = $(target).attr('class');

        const shouldClick = $(e.target).parents('.popover.in').length === 0
            && targetClass
            && !targetClass.includes('popover-toggler');

        if (shouldClick) {
            clickFunction();
        }
    });
}
