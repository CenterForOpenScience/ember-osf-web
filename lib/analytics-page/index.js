/* eslint-env node */

'use strict';

const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
    name: 'analytics-page',

    isDevelopingAddon() {
        return true;
    },

    lazyLoading: {
        // TODO: when the backend supports lazy engines, true this
        enabled: false,
    },

    cssModules: {
        headerModules: [
            'analytics-page/styles/headers',
        ],
    },

    included(...args) {
        this._super(...args);

        this.import('node_modules/keen-dataviz/dist/keen-dataviz.min.css');
        this.import('node_modules/keen-analysis/dist/keen-analysis.min.js', {
            using: [
                { transformation: 'amd', as: 'keen-analysis' },
            ],
        });
        this.import('node_modules/keen-dataviz/dist/keen-dataviz.js', {
            using: [
                { transformation: 'amd', as: 'keen-dataviz' },
            ],
        });
    },
});
