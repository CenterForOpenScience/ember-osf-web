import EmberRouter from '@ember/routing/router';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

const Router = EmberRouter.extend({
    metrics: service('metrics'),
    ready: service('ready'),

    location: config.locationType,
    rootURL: config.rootURL,

    init() {
        this._super(...arguments);
        const ready = this.get('ready');
        ready.onReady(() => {
            window.prerenderReady = true;
        });
    },

    willTransition() {
        this._super(...arguments);
        this.set('readyHandle', this.get('ready').wait());
    },

    didTransition() {
        this._super(...arguments);
        this._trackPage();
        this.get('readyHandle').finished();
    },

    _trackPage() {
        scheduleOnce('afterRender', this, () => {
            const page = this.get('url');
            const title = this.getWithDefault('currentRouteName', 'unknown');

            this.get('metrics').trackPage({ page, title });
        });
    },
});

/* eslint-disable array-callback-return */

Router.map(function() {
    // All non-guid routes (except `not-found`) belong above "Guid Routing"
    this.route('dashboard', { path: '/' });
    this.route('quickfiles');
    this.route('support');

    /*
     * Guid Routing
     *
     * Root guid URLs (e.g. "/mst3k/") will match the `resolve-guid` route, which
     * will ask the API what type of object the guid refers to, then transition
     * to the appropriate `guid-<type>` route below.
     *
     * Nested routes that begin with a guid should be unique across all types.
     * Do not add duplicate nested routes, like `guid-node/quickfiles`.
     */
    this.route('guid-file', { path: '/:file_guid' });
    this.route('guid-node', { path: '/:node_guid' });
    this.route('guid-preprint', { path: '/:preprint_guid' });
    this.route('guid-registration', { path: '/:registration_guid' });
    this.route('guid-user', { path: '/:user_guid' }, function() {
        this.route('quickfiles');
    });

    // If there are multiple routes with the same path pattern (e.g. `resolve-guid`
    // and all the `guid-*` routes above), URLs that match will resolve to the
    // route defined last. It's very intuitive.
    this.route('resolve-guid', { path: '/:guid' });

    // Catch-all 404 page
    this.route('not-found', { path: '*path' });
});

/* eslint-enable array-callback-return */

export default Router;
