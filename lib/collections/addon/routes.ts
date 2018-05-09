import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
    this.route('test');
    this.route('provider', { path: '/:provider_id' }, function() {
        this.route('discover');
        this.route('submit');
    });
});
