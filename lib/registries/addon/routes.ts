import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
    this.route('index', { path: '/registries' });
    this.route('discover', { path: '/registries/discover' });

    this.route('overview', { path: '/:guid' }, function() {
        this.route('analytics');
        this.route('forks');
    });

    this.route('page-not-found', { path: '/*path' });
});
