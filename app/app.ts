import Application from '@ember/application';
import config from 'ember-get-config';
import loadInitializers from 'ember-load-initializers';
import Resolver from './resolver';

const { modulePrefix } = config;

const App = Application.extend({
    modulePrefix,
    Resolver,

    engines: {
        'analytics-page': {
            dependencies: {
                services: [
                    'guid-context',
                ],
            },
        },
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
                ],
            },
        },
    },
});

loadInitializers(App, modulePrefix);

export default App;
