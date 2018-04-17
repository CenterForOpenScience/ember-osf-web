import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

import { Blocker } from 'ember-osf-web/services/ready';

const Router = EmberRouter.extend({
    currentUser: service('current-user'),
    statusMessages: service('status-messages'),
    ready: service('ready'),

    readyBlocker: null as Blocker | null,
    location: config.locationType,
    rootURL: config.rootURL,

    async willTransition(oldInfo, newInfo, transition) {
        const flag: string | undefined = config.featureFlags.routes[transition.targetName];

        if (flag) {
            const enabled = await this.get('currentUser').getWaffle(flag);

            if (!enabled) {
                window.location.reload();
            }
        }

        this.set('readyBlocker', this.get('ready').getBlocker());
        this._super(oldInfo, newInfo, transition);
    },

    didTransition(...args) {
        this._super(...args);
        this.get('statusMessages').updateMessages();
        window.scrollTo(0, 0);

        const readyBlocker = this.get('readyBlocker');

        if (readyBlocker) {
            readyBlocker.done();
        }
    },
});

/* eslint-disable array-callback-return */

Router.map(function () {
    // All non-guid routes (except `not-found`) belong above "Guid Routing"
    this.route('home', { path: '/' });
    this.route('goodbye');
    this.route('dashboard');
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
    this.route('guid-user', { path: '/:user_guid' }, function () {
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
