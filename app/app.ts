import Application from '@ember/application';
import config from 'ember-get-config';
import loadInitializers from 'ember-load-initializers';
import Resolver from './resolver';

const { modulePrefix } = config;

const App = Application.extend({
    modulePrefix,
    Resolver,
    // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
    engines: {
        collections: {
            dependencies: {
                externalRoutes: {
                    home: 'home',
                    support: 'support',
                },
                services: [
                    'analytics',
                    'current-user',
                    'features',
                    'head-data',
                    'intl',
                    'page-title-list',
                    'session',
                    'store',
                    'theme',
                    'toast',
                    'router',
                    'ready',
                    'osf-modal-state',
                    'osf-router',
                ],
            },
        },
        registries: {
            dependencies: {
                services: [
                    'analytics',
                    'cookies',
                    'current-user',
                    'features',
                    'head-data',
                    'meta-tags',
                    'head-tags',
                    'intl',
                    'media',
                    'page-title-list',
                    'ready',
                    'router',
                    'session',
                    'status-messages',
                    'store',
                    'osf-modal-state',
                    'osf-router',
                ],
                externalRoutes: {
                    'guid-registration': 'guid-registration',
                    'guid-registration.analytics': 'guid-registration.analytics',
                    'guid-registration.forks': 'guid-registration.forks',
                },
            },
        },
        analyticsPage: {
            dependencies: {
                services: [
                    'intl',
                    'cookies',
                    'store',
                    'analytics',
                    'ready',
                    'features',
                    'page-title-list',
                    'router',
                    'head-data',
                    'osf-modal-state',
                    'osf-router',
                ],
                externalRoutes: {
                    nodeForks: 'guid-node.forks',
                    registrationForks: 'guid-registration.forks',
                },
            },
        },
    },
});

loadInitializers(App, modulePrefix);

export default App;
