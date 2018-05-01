import Mixin from '@ember/object/mixin';
import Route from '@ember/routing/route';
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
    session: service('session'),
    router: service('router'),

    /**
     * Checks whether the session is authenticated, and if it is not, attempts to authenticate it, and if that fails,
     * redirects to the login URL. (Sending back to this page after a successful transition)
     *
     * __If `beforeModel` is overridden in a route that uses this mixin, the route's
     * implementation must call `this._super(transition)`__ so that the mixin's
     * `beforeModel` method is actually executed.
     * @method beforeModel
     * @public
     */
    async beforeModel(transition: { targetName: string, params: any[], queryParams: object }): Promise<any | void> {
        try {
            if (!this.get('session').get('isAuthenticated')) {
                await this.get('session').authenticate('authenticator:osf-cookie');
            }

            return this._super(transition);
        } catch (e) {
            // Reference: http://stackoverflow.com/a/39054607/414097
            const router = this.get('router');
            const params = Object.values(transition.params).filter(param => Object.values(param).length);
            const { queryParams, targetName } = transition;

            let url;

            try {
                if (Object.keys(queryParams).length) {
                    params.push(queryParams);
                }

                url = router.urlFor(targetName, ...params);
            } catch (ex) {
                // Handle routes without dynamic segments or query params
                url = router.urlFor(targetName);
            }

            window.location.href = getAuthUrl(`${window.location.origin}${url}`);
        }
    },
}) as Mixin<Route>;
