/* eslint-env node */

module.exports = {
    name: 'osf-components',

    isDevelopingAddon() {
        return true;
    },

    options: {
        cssModules: {
            headerModules: [
                'osf-components/styles/headers',
            ],
        },
    },
};
