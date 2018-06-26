/* eslint-env node */

const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
    name: 'collections',

    lazyLoading: {
        enabled: true,
    },

    isDevelopingAddon() {
        return true;
    },
});
