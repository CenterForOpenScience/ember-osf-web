import { service } from '@ember-decorators/service';
import { assert } from '@ember/debug';
import Route from '@ember/routing/route';
import { Registry as Services } from '@ember/service';
import config from 'ember-get-config';
import RSVP from 'rsvp';

import transitionTarget from 'ember-osf-web/utils/transition-target';

const {
    featureFlags: {
        routes,
    },
} = config as { featureFlags: { routes: { [index: string]: string } } }; // eslint-disable-line no-use-before-define

/**
 * Class decorator for feature flagging Routes.
 * In the `beforeModel` hook, check whether the route is feature flagged.
 * If the route is not flagged, proceed normally.
 * If the route is flagged and the route feature is enabled, proceed normally.
 * If the route is flagged and the route feature is not enabled, redirect to route url (forcing a page load).
 *
 * Use:
 * ```
 * // Check if route is feature flag and force page load if it's flagged, but not enabled.
 * @featureFlagRoute()
 * class MyRoute extends Route { ... }
 *
 * Uses the mixin pattern here: https://github.com/Microsoft/TypeScript/pull/13743
 */
export default function featureFlagRouteFactory() {
    function featureFlagRouteDecorator<T extends Newable<Route>>(RouteSubclass: T) {
        class FeatureFlaggedRoute extends RouteSubclass {
            @service features!: Services['features'];
            @service router!: Services['router'];

            beforeModel(transition: any) {
                const flag = routes[transition.targetName];

                assert(`No flag defined for feature flagged route: ${transition.targetName}`, Boolean(flag));

                if (flag && !this.features.isEnabled(flag)) {
                    // Force a page load of the target route.
                    window.location.replace(transitionTarget(transition, this.router));
                    return new RSVP.Promise(() => { /* never resolve, just wait for the page load */ });
                }

                return super.beforeModel(transition);
            }
        }

        return FeatureFlaggedRoute;
    }
    return featureFlagRouteDecorator;
}
