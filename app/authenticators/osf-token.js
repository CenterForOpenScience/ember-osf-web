import RSVP from 'rsvp';
import $ from 'jquery';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

import config from 'ember-get-config';

/**
 * @module ember-osf-web
 * @submodule authenticators
 */

/**
 * Ember-simple-auth compatible authenticator based on OAuth2 bearer tokens.
 *
 * Intended to be used with the authorizer of the same name.
 *
 * @class OsfTokenAuthenticator
 * @extends ember-simple-auth/BaseAuthenticator
 */
export default BaseAuthenticator.extend({
    _test(accessToken) {
        return $.ajax({
            method: 'GET',
            url: `${config.OSF.apiUrl}/${config.OSF.apiNamespace}/users/me/`,
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {
                withCredentials: false,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then(function(res) {
            res.data.attributes.accessToken = accessToken;
            return res.data;
        });
    },
    restore(data) {
        const { accessToken } = data.attributes;
        return this._test(accessToken).fail(this.invalidate);
    },
    authenticate(accessToken) {
        // Adds the entire API user endpoint record to the session store as given
        const jqDeferred = this._test(accessToken);
        return new RSVP.Promise((resolve, reject) => {
            // TODO: Improve param capture
            jqDeferred.done(value => resolve(value));
            jqDeferred.fail(reason => reject(reason));
        });
    },
});
