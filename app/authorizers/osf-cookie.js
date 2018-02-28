import Base from 'ember-simple-auth/authorizers/base';
/**
 * @module ember-osf-web
 * @submodule authorizers
 */

/**
 * Ember-simple-auth compatible authorizer based on session cookie.
 *
 * Intended to be used with the authenticator of the same name.
 *
 * @class OsfCookieAuthorizer
 * @extends ember-simple-auth/BaseAuthorizer
 */
export default Base.extend({
    authorize(/* data, block */) {
        // Cookies will be sent automatically with requests; no specific actions needed
    },
});
