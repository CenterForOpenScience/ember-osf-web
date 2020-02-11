import Engine from 'ember-engines/engine';
import loadInitializers from 'ember-load-initializers';
import Resolver from './resolver';
import config from './config/environment';

const { modulePrefix } = config;

const Eng = Engine.extend({
    modulePrefix,
    Resolver,
    dependencies: {
        services: [
            'intl',
            'cookies',
            'store',
            'analytics',
            'ready',
            'features',
            'router',
            'osf-modal-state',
            'osf-router',
            'page-title-list',
            'head-data',
        ],
        externalRoutes: [
            'nodeForks',
            'registrationForks',
        ],
    },
});

loadInitializers(Eng, modulePrefix);

export default Eng;
