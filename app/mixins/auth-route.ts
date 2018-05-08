import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import config from 'ember-get-config';
import SessionService from 'ember-simple-auth/services/session';

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
 * @authRoute
 * class MyRoute extends Route { ... }
 * ```
 *
 * Uses the mixin pattern here: https://github.com/Microsoft/TypeScript/pull/13743
 */
export default function authRoute<T extends Newable<Route>>(
    RouteSubclass: T,
) {
    class AuthenticatedRoute extends RouteSubclass {
        @service session!: SessionService;

        async beforeModel(transition: any) {
            try {
                if (!this.session.isAuthenticated) {
                    // Check whether user is actually logged in.
                    await this.session.authenticate(authenticator);
                }
            } catch (e) {
                // Definitely not logged in. When they do log in, refresh the route.
                this.session.on('authenticationSucceeded', this, this.refresh);
            }
            // In any case, let the route load normally.
            return super.beforeModel(transition);
        }
    }

    return AuthenticatedRoute;
}
