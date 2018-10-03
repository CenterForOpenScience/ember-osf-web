import Engine from '@ember/engine';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import Resolver from './resolver';

const { modulePrefix } = config;

const engine = Engine.extend({
    modulePrefix,
    Resolver,

    dependencies: {
        services: [
            'analytics',
            'cookies',
            'current-user',
            'features',
            'head-data',
            'i18n',
            'page-title-list',
            'password-strength',
            'ready',
            'route-context',
            'router',
            'session',
            'status-messages',
            'store',
            'theme',
        ],
    },
});

loadInitializers(engine, modulePrefix);

export default engine;
