import Component from '@ember/component';
import layout from './template';

/**
 * @module ember-osf-web
 * @submodule components
 */

/**
 * Display copyright information as a footer
 * @class osf-copyright
 */
export default Component.extend({
    layout,
    currentYear: (new Date()).getUTCFullYear().toString(),
});
