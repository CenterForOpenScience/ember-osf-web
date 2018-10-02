/* eslint-env node */

module.exports = {
    name: 'app-components',

    isDevelopingAddon() {
        return true;
    },

    options: {
        cssModules: {
            headerModules: [
                'app-components/styles/headers',
            ],
        },
    },
};
