/* eslint-env node */

const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
    name: 'registries',

    lazyLoading: {
        enabled: true,
    },

    isDevelopingAddon() {
        return true;
    },

    cssModules: {
        headerModules: [
            'registries/styles/variables',
            'registries/styles/mixins',
            'registries/styles/typography',
        ],
    },

    'ember-font-awesome': {
        includeFontAwesomeAssets: false,
    },

    'ember-bootstrap': {
        importBootstrapFont: false,
        importBootstrapCSS: false,
    },

    included(app, ...args) {
        this._super(app, ...args);

        this.import('node_modules/immutable/dist/immutable.js', {
            using: [
                { transformation: 'amd', as: 'immutable' },
            ],
        });
    },
});
