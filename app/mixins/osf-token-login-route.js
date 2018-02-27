import Ember from 'ember';

import config from 'ember-get-config';

import { getTokenFromHash } from 'ember-osf-web/utils/auth';

/**
 * @module ember-osf-web
 * @submodule mixins
 */

/**
 * Route mixin to add support for OAuth2 token based authentication
 *
 * Intended to be used in tandem with OsfTokenLoginControllerMixin
 *
 * @class OsfTokenLoginRouteMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
    session: Ember.inject.service(),
    beforeModel() {
        // TODO: Should this check for resolution of a promise?
        this._super(...arguments);

        let accessToken;
        if (config.OSF.isLocal) {
            ({ accessToken } = config.OSF);
        } else {
            accessToken = getTokenFromHash(window.location.hash);
            if (!accessToken) {
                return null;
            }
            window.location.hash = '';
        }

        return this.get('session').authenticate('authenticator:osf-token', accessToken)
            .catch(err => Ember.Logger.log('Authentication failed: ', err));
    },
});
