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

        this.import('node_modules/d3/dist/d3.min.js', {
            using: [ { transformation: 'amd', as: 'd3' } ],
        });
        this.import('node_modules/c3/c3.min.js', {
            using: [ { transformation: 'amd', as: 'c3' } ],
        });
        this.import('node_modules/c3/c3.min.css');
    },
});
