import Component from '@ember/component';
import { inject as service } from '@ember/service';
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
    analytics: service(),
    layout,
    currentYear: (new Date()).getUTCFullYear().toString(),
});
