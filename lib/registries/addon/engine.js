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
            'meta-tags',
            'head-tags',
            'i18n',
            'media',
            'page-title-list',
            'ready',
            'router',
            'session',
            'status-messages',
            'store',
        ],
        externalRoutes: [
            'guid-registration',
            'guid-registration.analytics',
            'guid-registration.forks',
        ],
    },
});

loadInitializers(engine, modulePrefix);

export default engine;
