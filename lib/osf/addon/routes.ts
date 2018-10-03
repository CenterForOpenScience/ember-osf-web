import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
    // All non-guid routes (except error routes) belong above "Guid Routing"
    this.route('home', { path: '/' });
    this.route('dashboard');
    this.route('goodbye');
    this.route('institutions');
    this.route('quickfiles');
    this.route('register');
    this.route('settings', function() {
        this.route('tokens', function() {
            this.route('edit', { path: '/:token_id' });
            this.route('create');
        });
    });
    this.route('support');

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
});
