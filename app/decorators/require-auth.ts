import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import SessionService from 'ember-simple-auth/services/session';

import CurrentUser from 'ember-osf-web/services/current-user';
import transitionTargetURL from 'ember-osf-web/utils/transition-target-url';

/**
 * Class decorator for Routes.
 * In the `beforeModel` hook, check whether the user is logged in.
 * If they are, let the transition continue as normal.
 * If not, transition to the given route or redirect to the login page.
 *
 * Use:
 * ```
 * // If not logged in, redirect to login page
 * @requireAuth()
 * class MyRoute extends Route { ... }
 *
 * // If not logged in, transition to 'home' route
 * @requireAuth('home')
 * class MyRoute extends Route { ... }
 * ```
 *
 * Uses the mixin pattern here: https://github.com/Microsoft/TypeScript/pull/13743
 */
export default function requireAuthFactory(
    redirectRoute?: string,
) {
    function requireAuthDecorator<T extends ConcreteSubclass<Route>>(RouteSubclass: T) {
        class RequireAuthRoute extends RouteSubclass {
            @service session!: SessionService;
            @service currentUser!: CurrentUser;

            async beforeModel(transition: any) {
                if (!this.session.isAuthenticated) {
                    if (redirectRoute) {
                        this.transitionTo(redirectRoute);
                    } else {
                        await this.currentUser.login(
                            transitionTargetURL(transition),
                        );
                    }
                }

                return super.beforeModel(transition);
            }
        }

        return RequireAuthRoute;
    }
    return requireAuthDecorator;
}
