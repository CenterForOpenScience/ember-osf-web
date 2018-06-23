import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import { Blocker } from 'ember-osf-web/services/ready';

const {
    featureFlags: {
        routes,
    },
} = config as { featureFlags: { routes: { [index: string]: string } } }; // eslint-disable-line no-use-before-define

const Router = EmberRouter.extend({
    currentUser: service('current-user'),
    features: service('features'),
    statusMessages: service('status-messages'),
    ready: service('ready'),

    readyBlocker: null as Blocker | null,
    location: config.locationType,
    rootURL: config.rootURL,

    async willTransition(oldInfo: any, newInfo: any, transition: { targetName: string }) {
        const flag = routes[transition.targetName];

        if (flag) {
            await this.get('currentUser').featuresAreLoaded();
            if (!this.get('features').isEnabled(flag)) {
                window.location.reload();
            }
        }

        this.get('currentUser').checkShowTosConsentBanner();

        if (!this.readyBlocker || this.readyBlocker.isDone()) {
            this.readyBlocker = this.get('ready').getBlocker();
        }
        this._super(oldInfo, newInfo, transition);
    },

    didTransition(...args: any[]) {
        this._super(...args);
        this.get('statusMessages').updateMessages();
        window.scrollTo(0, 0);
        if (this.readyBlocker && !this.readyBlocker.isDone()) {
            this.readyBlocker.done();
        }
    },
});

const {
    engines: {
        collections,
        handbook,
    },
} = config;

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
        this.route('forks');
    });
    this.route('guid-preprint', { path: '/:preprint_guid' });
    this.route('guid-registration', { path: '/:registration_guid' }, function() {
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

    // Error routes
    this.route('error-no-api', { path: '*no_api_path' });
    this.route('not-found', { path: '*path' });
});

/* eslint-enable array-callback-return */

export default Router;
