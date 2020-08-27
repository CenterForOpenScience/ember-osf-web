import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
    this.route('index', { path: '/registries' });
    this.route('discover', { path: '/registries/discover' });
    this.route('branded', { path: '/registries/:providerId' }, function() {
        this.route('discover');
        this.route('new');
        this.route('moderation', function() {
            this.route('index', { path: '/' }, function() {
                this.route('submissions');
                this.route('withdrawals');
                this.route('moderators');
            });
            this.route('overview', { path: '/:guid' });
        });
    });

    this.route('start', { path: '/registries/start' });

    this.route('forms', { path: '/registries/forms' }, function() {
        this.route('help');
    });

    this.route('drafts', { path: '/registries/drafts' }, function() {
        this.route('draft', { path: '/:id' }, function() {
            this.route('page', { path: '/:page' });
            this.route('review');
            this.route('metadata');
        });
    });

    this.route('overview', { path: '/:guid' } as any, function() {
        this.route('analytics');
        this.route('children', { path: '/components' });
        this.route('comments');
        this.route('forks');
        this.route('links');
    });

    this.route('page-not-found', { path: '/*path' });
});
