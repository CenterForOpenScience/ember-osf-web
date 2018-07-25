import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
    this.route('discover');
    this.route('submit');

    this.route('provider', { path: '/:slug' }, function() {
        this.route('discover');
        this.route('submit');
        this.route('page-not-found', { path: '*path' });
    });

    this.route('page-not-found', { path: '*path' });
});
