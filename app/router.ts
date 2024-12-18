import EmberRouter from '@ember/routing/router';
import config from 'ember-osf-web/config/environment';

const {
    engines: {
        collections,
        registries,
    },
} = config;

const Router = EmberRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL,
});

/* eslint-disable array-callback-return */

Router.map(function() {
    // All non-guid routes (except error routes) belong above "Guid Routing"
    this.route('home', { path: '/' });
    this.route('dashboard');
    this.route('goodbye');
    this.route('search');
    this.route('institutions', function() {
        this.route('discover', { path: '/:institution_id' });
        this.route('dashboard', { path: '/:institution_id/dashboard' }, function() {
            this.route('projects');
            this.route('registrations');
            this.route('preprints');
            this.route('users');
        });
    });

    this.route('preprints', function() {
        this.route('index', { path: '/:provider_id' });
        this.route('index', { path: '/' });
        this.route('discover', { path: '/:provider_id/discover' });
        this.route('detail', { path: '/:provider_id/:guid' });
        this.route('submit', { path: '/:provider_id/submit' });
        this.route('edit', { path: '/:provider_id/edit/:guid' });
        this.route('new-version', { path: '/:provider_id/new-version/:guid' });
        this.route('select');
        this.route('my-preprints');
    });


    this.route('register');
    this.route('settings', function() {
        this.route('profile', function() {
            this.route('education');
            this.route('employment');
            this.route('name');
            this.route('social');
        });
        this.route('developer-apps', { path: '/applications' }, function() {
            this.route('edit', { path: '/:developer_app_id' });
            this.route('create');
        });
        this.route('account');
        this.route('tokens', function() {
            this.route('edit', { path: '/:token_id' });
            this.route('create');
        });
    });
    this.route('meetings', function() {
        this.route('detail', { path: '/:meeting_id' });
    });

    if (collections.enabled) {
        this.mount('collections');
    }

    if (registries.enabled) {
        this.mount('registries', { path: '--registries' });
    }

    this.route('guid-file', { path: '--file/:guid' }, function() {
        this.route('index', { path: '/'});
        this.route('metadata', function() {
            this.route('add');
        });
    });

    this.route('guid-node', { path: '--node/:guid' }, function() {
        this.mount('analytics-page', { as: 'analytics' });
        this.route('forks');
        this.route('files', function() {
            this.route('provider', { path: '/:providerId' });
        });
        this.route('metadata', function() {
            this.route('index', { path: '/'});
            this.route('detail', { path: '/:recordId' });
            this.route('add');
        });
        this.route('registrations');
        this.route('drafts', { path: '/drafts/:draftId' }, function() {
            this.route('register');
        });
    });


    this.route('guid-registration', { path: '--registration/:guid' }, function() {
        this.mount('analytics-page', { as: 'analytics' });
        this.route('forks');
    });


    /*
     * Guid Routing
     *
     * Root guid URLs (e.g. "/mst3k/") will match the `resolve-guid` route, which
     * will ask the API what type of object the guid refers to, then transition
     * to the appropriate route based off the `routeMap` property.
     *
     * Routes that handle guid objects should prefix their routes with the type
     * it handles prefixed with `--` (e.g. "--user/:user_guid")
     * The GuidLocation implementation will remove URL segments prefixed with `--`
     * resulting in clean guid URLs while still respecting Ember's routing semantics.
     */
    this.route('resolve-guid', { path: ':guid' }, function() {
        this.route('subpath', { path: '*path' });
    });

    // Error routes
    this.route('error-no-api', { path: '*no_api_path' });
    // eslint-disable-next-line ember/no-shadow-route-definition
    this.route('not-found', { path: '*path' });
});

/* eslint-enable array-callback-return */

export default Router;
