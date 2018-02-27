import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

/**
 * @module ember-osf-web
 * @submodule components
 */

/**
 * Display a search dropdown as used in the OSF navbar
 *
 * Sample usage:
 * ```handlebars
 *   {{search-dropdown action=(action 'toggleSearch')}}
 * ```
 * @class search-dropdown
 */
export default Ember.Component.extend({
    layout,
    host: config.OSF.url,
    i18n: Ember.inject.service(),
    query: null,
    isOpen: false, // is help modal open?
    actions: {
        // Runs toggleSearch in parent component, osf-navbar
        toggleSearch() {
            this.get('action')();
        },
        search() {
            const query = this.get('query');
            if (query) {
                window.location.href = `${this.host}search/?q=${query}`;
            }
        },
        close() {
            this.set('isOpen', false);
        },
        toggleHelpModal() {
            this.toggleProperty('isOpen');
        },
    },
});
