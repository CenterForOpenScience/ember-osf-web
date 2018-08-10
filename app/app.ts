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
                    'router',
                    'store',
                ],
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
