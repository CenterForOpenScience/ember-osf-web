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
            'currentUser',
            'i18n',
            'session',
            'store',
            'theme',
            'router',
        ],
    },
});

loadInitializers(engine, modulePrefix);

export default engine;
