import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
    this.route('page-not-found');
    this.route('forbidden');
    this.route('discover');
    this.route('submit');
    this.route('guid', { path: '/:guid' }, function() {
        this.route('edit');
    });

    this.route('provider', { path: '/:slug' }, function() {
        this.route('page-not-found');
        this.route('forbidden');
        this.route('discover');
        this.route('submit');
        this.route('guid', { path: '/:guid' }, function() {
            this.route('edit');
        });
    });
});
