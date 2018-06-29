/* eslint-env node */

'use strict';

const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
    name: 'analytics-page',

    isDevelopingAddon() {
        return true;
    },

    lazyLoading: {
        enabled: true,
    },

    cssModules: {
        headerModules: [
            'analytics-page/styles/headers',
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

        this.import('node_modules/keen-analysis/dist/keen-analysis.min.js', {
            using: [
                { transformation: 'amd', as: 'keen-analysis' },
            ],
        });
        this.import('node_modules/keen-dataviz/dist/keen-dataviz.min.css');
        this.import('node_modules/keen-dataviz/dist/keen-dataviz.min.js', {
            using: [
                { transformation: 'amd', as: 'keen-dataviz' },
            ],
        });
    },
});
