import config from 'ember-get-config';
import $ from 'jquery';
import RSVP from 'rsvp';

const { authorizationType } = config;
const isCookieAuth: boolean = authorizationType === 'cookie';

/**
 * Helper functions for asynchronous behavior
 *
 * @module ember-osf-web
 * @module utils
 */

/**
 * Helper functions to support AJAX requests
 * @class ajax-helpers
 */

/**
 * Performs an AJAX request with any additional authorization config as needed for the configured authorization type.
 * Allows manual AJAX requests to be authorization-agnostic when using this addon.
 *
 * Primarily used to set XHR flags on manual AJAX requests, for cookie based authorization.
 * @method authenticatedAJAX
 * @param {Object} options
 * @return {RSVP.Promise}
 */
export default function authenticatedAJAX(options: object): RSVP.Promise<any> {
    const opts = {
        ...options,
        ...(isCookieAuth ? { xhrFields: { withCredentials: true } } : {}),
    };

    // Return RSVP.Promise so the callbacks are run within the current runloop
    return new RSVP.Promise((resolve, reject) => $.ajax(opts).then(resolve).catch(reject));
}
