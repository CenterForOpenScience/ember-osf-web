import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
    this.route('discover');
    this.route('page-not-found', { path: '/*path' });
});
