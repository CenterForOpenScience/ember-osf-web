import Ember from 'ember';
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
export default Ember.Component.extend({
    layout,
    currentYear: (new Date()).getUTCFullYear().toString(),
    analytics: service(),
});
