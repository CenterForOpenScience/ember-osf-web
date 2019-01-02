import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
    this.route('docs', function() {
        this.route('intro');
        this.route('assumptions');
        this.route('contributing');

        // Dev
        this.route('quickstart');
        this.route('how-to');
        this.route('git');
        this.route('dev-env');
        this.route('conventions');
        this.route('testing');
        this.route('analytics');
        this.route('community');
        this.route('resources');
        this.route('troubleshooting');

        // Style guide
        this.route('visual-style');
        this.route('written-style');

        this.route('components', function() {
            this.route('ancestry-display');
            this.route('bs-alert');
            this.route('contributor-list');
            this.route('copyable-text');
            this.route('delete-button');
            this.route('osf-link');
            this.route('institutions-widget');
            this.route('loading-indicator');
            this.route('new-project-modal');
            this.route('new-project-navigation-modal');
            this.route('osf-button');
            this.route('osf-link');
            this.route('panel');
            this.route('placeholder');
            this.route('tags-widget');
            this.route('validated-model-form');
        });

        this.route('api', function() {
            this.route('item', { path: '/*path' });
        });
    });

    this.route('not-found', { path: '/*path' });
});
