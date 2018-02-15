import Ember from 'ember';
import config from 'ember-get-config';

/**
 * Helper functions for asynchronous behavior
 *
 * @module ember-osf
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
 * @return {Promise}
 */
export default function authenticatedAJAX(options) {
    if (config.authorizationType === 'cookie') {
        Ember.merge(options, {
            xhrFields: {
                withCredentials: true,
            },
        });
    }
    return Ember.$.ajax(options);
}
