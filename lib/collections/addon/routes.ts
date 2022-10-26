import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
    this.route('page-not-found');
    this.route('forbidden');
    this.route('discover');
    this.route('submit');
    this.route('guid', { path: '/:guid' }, function() {
        this.route('edit');
    });

    // eslint-disable-next-line ember/no-shadow-route-definition
    this.route('provider', { path: '/:slug' }, function() {
        this.route('page-not-found');
        this.route('forbidden');
        this.route('discover');
        this.route('submit');
        this.route('guid', { path: '/:guid' }, function() {
            this.route('edit');
        });
        this.route('moderation', function() {
            this.route('all');
            this.route('moderators');
            this.route('settings');
        });
    });
});
