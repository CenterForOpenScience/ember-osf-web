import Ember from 'ember';

import { getAuthUrl } from 'ember-osf-web/utils/auth';

/**
 * @module ember-osf
 * @submodule mixins
 */

/**
 * Controller mixin to add support for OAuth2 token based authentication
 *
 * Intended to be used in tandem with OsfTokenLoginRouteMixin
 *
 * @class OsfTokenLoginControllerMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
    session: Ember.inject.service(),
    actions: {
        login() {
            window.location = getAuthUrl(window.location);
        },
        loginSuccess() {},
        loginFail() {},
    },
});
