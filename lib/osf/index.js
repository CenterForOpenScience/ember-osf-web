/* eslint-env node */

const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
    name: 'osf',

    lazyLoading: {
        enabled: true,
    },

    isDevelopingAddon() {
        return true;
    },

    sassOptions: {
        includePaths: [
            'node_modules/@centerforopenscience/osf-style/sass',
        ],
    },

    cssModules: {
        headerModules: [
            'osf/styles/headers',
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
    },
});
