import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
    this.route('index', { path: '/registries' });
    this.route('branded', { path: '/registries/:providerId' }, function() {
        this.route('discover');
        this.route('new');
        this.route('moderation', function() {
            this.route('submitted');
            this.route('pending');
            this.route('moderators');
            this.route('settings');
        });
    });

    this.route('my-registrations', { path: '/registries/my-registrations' });
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

    this.route('edit-revision', { path: '/registries/revisions/:revisionId' }, function() {
        this.route('justification');
        this.route('page', { path: '/:page' });
        this.route('review');
    });

    this.route('overview', { path: '/:guid' } as any, function() {
        this.route('analytics');
        this.route('children', { path: '/components' });
        this.route('comments');
        this.route('files', function() {
            this.route('provider', { path: '/:providerId' });
        });
        this.route('resources');
        this.route('forks');
        this.route('links');
        this.route('metadata');
    });


    this.route('page-not-found', { path: '/*path' });
});
