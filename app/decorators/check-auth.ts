import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import { Registry as ServiceRegistry } from '@ember/service';
import config from 'ember-get-config';
import SessionService from 'ember-simple-auth/services/session';

import { NotLoggedIn } from 'ember-osf-web/errors';
import transitionTargetURL from 'ember-osf-web/utils/transition-target-url';

const {
    OSF: {
        authenticator,
    },
} = config;

/**
 * Class decorator for Routes.
 * In the `beforeModel` hook, try authenticating the user if they're not already authenticated.
 *
 * Use:
 * ```
 * @checkAuth
 * class MyRoute extends Route { ... }
 * ```
 *
 * Uses the mixin pattern here: https://github.com/Microsoft/TypeScript/pull/13743
 */
export default function checkAuth<T extends Newable<Route>>(
    RouteSubclass: T,
) {
    class AuthenticatedRoute extends RouteSubclass {
        @service router!: ServiceRegistry['router'];
        @service session!: SessionService;

        async beforeModel(transition: any) {
            try {
                if (!this.session.isAuthenticated) {
                    // Check whether user is actually logged in.
                    await this.session.authenticate(authenticator);
                }
            } catch (e) {
                if (e instanceof NotLoggedIn) {
                    // Definitely not logged in. When they do log in, refresh the route.
                    this.session.on('authenticationSucceeded', this, this.refresh);
                } else if (transition.targetName !== 'error-no-api') {
                    // Must have failed to make the request at all.
                    this.transitionTo(
                        'error-no-api',
                        transitionTargetURL(transition).slice(1),
                    );
                    return;
                }
            }
            // In any case, let the route load normally.
            return super.beforeModel(transition);
        }
    }

    return AuthenticatedRoute;
}
