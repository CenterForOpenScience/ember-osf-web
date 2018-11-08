import buildRoutes from 'ember-engines/routes';

const serializeRegistration = (model: any) => ({
    guid: model.id || model.registrationId,
});

export default buildRoutes(function() {
    this.route('index', { path: '/registries' });
    this.route('discover', { path: '/registries/discover' });

    this.route('overview', { path: '/:guid', serialize: serializeRegistration } as any, function() {
        this.route('analytics');
        this.route('comments');
        this.route('forks');
    });

    this.route('page-not-found', { path: '/*path' });
});
