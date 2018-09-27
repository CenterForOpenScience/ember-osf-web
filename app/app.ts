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
                services: [
                    'i18n',
                    'session',
                    'store',
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
                    'media',
                    'page-title-list',
                    'router',
                    'session',
                    'status-messages',
                    'store',
                ],
                externalRoutes: {
                    registration: 'guid-registration',
                },
            },
        },
        analyticsPage: {
            dependencies: {
                services: [
                    'i18n',
                    'route-context',
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
