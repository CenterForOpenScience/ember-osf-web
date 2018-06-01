import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
    this.route('docs', function() {
        this.route('intro');
        this.route('assumptions');
        this.route('contributing');

        // Dev
        this.route('quickstart');
        this.route('git');
        this.route('dev-env');
        this.route('conventions');
        this.route('testing');
        this.route('community');
        this.route('resources');

        // Style guide
        this.route('visual-style');
        this.route('written-style');

        this.route('components', function() {
            this.route('loading-indicator');
        });

        this.route('api', function() {
            this.route('item', { path: '/*path' });
        });
    });

    this.route('not-found', { path: '/*path' });
});
