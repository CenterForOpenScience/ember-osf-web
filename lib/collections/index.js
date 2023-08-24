/* eslint-env node */

const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
    name: 'collections',

    isDevelopingAddon() {
        return true;
    },

    lazyLoading: {
        enabled: true,
    },

    cssModules: {
        headerModules: [
            'collections/styles/headers',
        ],
    },

    'ember-font-awesome': {
        includeFontAwesomeAssets: false,
    },
});
