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
            this.route('all', function() {
                this.route('pending');
                this.route('public');
                this.route('rejected');
                this.route('removed');
            });
            this.route('moderators');
            this.route('settings');
        });
    });
});
