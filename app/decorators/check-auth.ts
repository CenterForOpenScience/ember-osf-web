import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import { Registry as ServiceRegistry } from '@ember/service';
import config from 'ember-get-config';
import SessionService from 'ember-simple-auth/services/session';

import { NotLoggedIn } from 'ember-osf-web/errors';
import CurrentUser from 'ember-osf-web/services/current-user';
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
export default function checkAuth<T extends ConcreteSubclass<Route>>(
    RouteSubclass: T,
) {
    class AuthenticatedRoute extends RouteSubclass {
        @service router!: ServiceRegistry['router'];
        @service session!: SessionService;
        @service currentUser!: CurrentUser;

        async beforeModel(transition: any) {
            // Need to handle view-only links before checking auth, and this is the only reasonable place to do it.
            // This limitation points toward replacing this decorator with a service method meant to be
            // called in Route.beforeModel. Decorator mixins should probably be considered an anti-pattern.
            const { viewOnlyToken = '' } = this.paramsFor('application') as Record<string, string>;

            try {
                if (!this.session.isAuthenticated || this.currentUser.viewOnlyToken !== viewOnlyToken) {
                    this.currentUser.setProperties({ viewOnlyToken });

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
                    return undefined;
                }
            }
            // In any case, let the route load normally.
            return super.beforeModel(transition);
        }
    }

    return AuthenticatedRoute;
}
