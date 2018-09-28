import Application from '@ember/application';
import config from 'ember-get-config';
import loadInitializers from 'ember-load-initializers';
import Resolver from './resolver';

const { modulePrefix } = config;

const App = Application.extend({
    modulePrefix,
    Resolver,

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
                    'i18n',
                    'session',
                    'store',
                    'theme',
                    'toast',
                    'router',
                ],
            },
        },
        handbook: {
            dependencies: {
                services: [
                    'analytics',
                    'i18n',
                    'router',
                    'store',
                    'toast',
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
                    'i18n',
                    'page-title-list',
                    'router',
                    'session',
                    'status-messages',
                    'store',
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
                    'i18n',
                    'cookies',
                    'store',
                    'analytics',
                    'ready',
                    'features',
                    'page-title-list',
                    'router',
                    'head-data',
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
