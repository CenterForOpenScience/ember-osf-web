import Engine from 'ember-engines/engine';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import Resolver from './resolver';

const { modulePrefix } = config;

const Eng = Engine.extend({
    modulePrefix,
    Resolver,
    dependencies: {
        services: [
            'analytics',
            'current-user',
            'features',
            'i18n',
            'ready',
            'router',
            'session',
            'store',
            'toast',
            'osf-modal-state',
            'osf-router',
            'media',
        ],
    },

    // HACK: ec-tailwind (used by ec-addon-docs) doesn't understand engines
    rootElement: 'body',
});

loadInitializers(Eng, modulePrefix);

export default Eng;
