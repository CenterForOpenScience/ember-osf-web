import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { getAuthUrl } from 'ember-osf-web/utils/auth';

/**
 * @module ember-osf-web
 * @submodule mixins
 */

/**
 * Replacement for Ember-simple-auth AuthenticatedRouteMixin. Instead of redirecting to an internal route,
 *   this mixin redirects to CAS login URL, and brings the user back to the last requested page afterwards
 *
 * For OAuth this is done via the state parameter, and for cookies this is done via the service parameter.
 * (TODO: Need a mixin that detects this!)
 *
 * @class CasAuthenticatedRouteMixin
 */
export default Mixin.create({
    /**
      The session service.
      @property session
      @readOnly
      @type SessionService
      @public
    */
    session: service('session'),
    routing: service('-routing'),

    /**
      Checks whether the session is authenticated, and if it is not, attempts to authenticate it, and if that fails,
      redirects to the login URL. (Sending back to this page after a successful transition)

      __If `beforeModel` is overridden in a route that uses this mixin, the route's
     implementation must call `this._super(...arguments)`__ so that the mixin's
     `beforeModel` method is actually executed.
      @method beforeModel
      @public
    */
    beforeModel(transition) {
        if (this.get('session.isAuthenticated')) { return this._super(...arguments); }
        return this.get('session').authenticate('authenticator:osf-cookie').then(() => {
            return this._super(...arguments);
        }).catch(() => {
            // Reference: http://stackoverflow.com/a/39054607/414097
            const routing = this.get('routing');
            const params = Object.values(transition.params).filter(param => Object.values(param).length);
            const url = routing.generateURL(transition.targetName, params, transition.queryParams);
            window.location.href = getAuthUrl(window.location.origin + url);
        });
    },
});
