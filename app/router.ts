import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

import { Blocker } from 'ember-osf-web/services/ready';
import transitionTargetURL from 'ember-osf-web/utils/transition-target-url';

const {
    engines: {
        collections,
        handbook,
    },
    featureFlagNames: {
        routes: routeFlags,
    },
} = config;

const Router = EmberRouter.extend({
    currentUser: service('current-user'),
    features: service('features'),
    statusMessages: service('status-messages'),
    ready: service('ready'),

    readyBlocker: null as Blocker | null,
    location: config.locationType,
    rootURL: config.rootURL,

    willTransition(oldInfo: any, newInfo: any, transition: { targetName: string }) {
        if (!this.readyBlocker || this.readyBlocker.isDone()) {
            this.readyBlocker = this.get('ready').getBlocker();
        }
        this._super(oldInfo, newInfo, transition);
    },

    didTransition(...args: any[]) {
        this._super(...args);

        this.get('currentUser').checkShowTosConsentBanner();
        this.get('statusMessages').updateMessages();

        window.scrollTo(0, 0);

        if (this.readyBlocker && !this.readyBlocker.isDone()) {
            this.readyBlocker.done();
        }
    },

    _doTransition(routeName: string, ...args: any[]) {
        const transition = this._super(routeName, ...args);

        const flag = routeFlags[transition.targetName];
        if (flag && !this.get('features').isEnabled(flag)) {
            try {
                window.location.assign(transitionTargetURL(transition));
            } catch (e) {
                window.location.reload();
            }
            transition.abort();
        }
        return transition;
    },
});

/* eslint-disable array-callback-return */

Router.map(function() {
    // All non-guid routes (except error routes) belong above "Guid Routing"
    this.route('home', { path: '/' });
    this.route('goodbye');
    this.route('dashboard');
    this.route('quickfiles');
    this.route('institutions');
    this.route('support');

    if (collections.enabled) {
        this.mount('collections');
    }
    if (handbook.enabled) {
        this.mount('handbook');
    }

    /*
     * Guid Routing
     *
     * Root guid URLs (e.g. "/mst3k/") will match the `resolve-guid` route, which
     * will ask the API what type of object the guid refers to, then transition
     * to the appropriate `guid-<type>` route below.
     *
     * Non-unique nested routes that begin with a guid need special handling.
     * See `resolve-guid.forks` for an example.
     */
    this.route('guid-file', { path: '/:file_guid' });
    this.route('guid-node', { path: '/:node_guid' }, function() {
        this.mount('analytics-page', { as: 'analytics' });
        this.route('forks');
        this.route('registrations');
    });
    this.route('guid-preprint', { path: '/:preprint_guid' });
    this.route('guid-registration', { path: '/:registration_guid' }, function() {
        this.mount('analytics-page', { as: 'analytics' });
        this.route('forks');
    });
    this.route('guid-user', { path: '/:user_guid' }, function() {
        this.route('quickfiles');
    });

    // If there are multiple routes with the same path pattern (e.g. `resolve-guid`
    // and all the `guid-*` routes above), URLs that match will resolve to the
    // route defined last. It's very intuitive.
    this.route('resolve-guid', { path: '/:guid' });
    this.route('resolve-guid.forks', { path: '/:guid/forks' });
    this.route('resolve-guid.analytics', { path: '/:guid/analytics' });

    // Error routes
    this.route('error-no-api', { path: '*no_api_path' });
    this.route('not-found', { path: '*path' });
});

/* eslint-enable array-callback-return */

export default Router;
