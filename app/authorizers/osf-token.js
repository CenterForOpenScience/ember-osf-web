import Base from 'ember-simple-auth/authorizers/base';

/**
 * @module ember-osf
 * @submodule authorizers
 */

/**
 * Ember-simple-auth compatible authorizer based on OAuth2 bearer tokens.
 *
 * Intended to be used with the authenticator of the same name.
 *
 * @class OsfTokenAuthorizer
 * @extends ember-simple-auth/BaseAuthorizer
 */
export default Base.extend({
    authorize(sessionData, setHeader) {
        setHeader('Authorization', `Bearer ${sessionData.attributes.accessToken}`);
    },
});
