/* eslint-env node */

'use strict';

const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
    name: 'analytics-page',

    lazyLoading: {
        // TODO: when the backend supports lazy engines, true this
        enabled: false,
    },

    isDevelopingAddon() {
        return true;
    },

    included(...args) {
        this._super(...args);

        this.import('node_modules/keen-analysis/dist/keen-analysis.min.js');
        this.import('node_modules/keen-dataviz/dist/keen-dataviz.min.css');
        this.import('node_modules/keen-dataviz/dist/keen-dataviz.min.js', {
            using: [
                { transformation: 'amd', as: 'keen-dataviz' },
            ],
        });
    },
});
