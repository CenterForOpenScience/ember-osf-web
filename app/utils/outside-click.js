import Ember from 'ember';

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
    Ember.$('body').on('click', (e) => {
        if (Ember.$(e.target).parents('.popover.in').length === 0 &&
            Ember.$(e.target).attr('class') &&
            Ember.$(e.target).attr('class').indexOf('popover-toggler') === -1) {
            clickFunction();
        }
    });
}
