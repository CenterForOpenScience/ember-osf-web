import Ember from 'ember';

import { getAuthUrl } from 'ember-osf-web/utils/auth';

/**
 * @module ember-osf-web
 * @submodule mixins
 */

/**
 * Controller mixin for login based on OSF cookie authentication. Intended to be used in tandem with OsfCookieLoginRoute mixin.
 * This auth method is not available to third-party applications.
 *
 * @class OsfCookieLoginController
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
    session: Ember.inject.service('session'),

    queryParams: ['ticket'],
    ticket: null,

    actions: {
        login() {
            window.location = getAuthUrl(window.location);
        },
        loginSuccess() {},
        loginFail() {},
    },
});
