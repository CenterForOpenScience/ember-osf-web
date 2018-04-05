import Component from '@ember/component';
import { inject as service } from '@ember/service';

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
    currentYear: (new Date()).getUTCFullYear().toString(),
});
