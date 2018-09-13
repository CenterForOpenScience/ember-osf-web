import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
    this.route('docs', function() {
        this.route('blah');

        this.route('components', function() {
            this.route('foo-bar');
            this.route('loading-indicator');
            this.route('not-foo-bar');
        });

        this.route('api', function() {
            this.route('item', { path: '/*path' });
        });
    });

    this.route('not-found', { path: '/*path' });
});
