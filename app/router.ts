import EmberRouter from '@ember/routing/router';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

const Router = EmberRouter.extend({
    session: service('session'),
    metrics: service('metrics'),

    location: config.locationType,
    rootURL: config.rootURL,

    didTransition() {
        this._super(...arguments);
        this._trackPage();
    },

    _trackPage() {
        scheduleOnce('afterRender', this, () => {
            const page = this.get('url');
            const title = this.getWithDefault('currentRouteName', 'unknown');
            const metrics = this.get('metrics');
            const {
                authenticated,
                isPublic,
                resource,
            } = config.metricsAdapters[0].dimensions;

            /*
              There's supposed to be a document describing how dimensions should be handled, but it doesn't exist yet.
              When it does, we'll replace out this comment with the link to that documentation. For now:
                  1) isPublic: Public, Private, or n/a (for pages that aren't covered by app permissions like the
                  dashboard;
                  2) authenticated: Logged in or Logged out
                  3) resource: the JSONAPI type (node, file, user, etc) or n/a
            */

            metrics.trackPage({
                [authenticated]: this.get('session.isAuthenticated') ? 'Logged in' : 'Logged out',
                [isPublic]: title === 'file-detail' ? 'Public' : 'n/a',
                page,
                [resource]: 'undefined',
                title,
            });
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
