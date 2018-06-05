/* eslint-env node */

module.exports = {
    name: 'osf-components',

    isDevelopingAddon() {
        return true;
    },

    options: {
        sassOptions: {
            includePaths: [
                'app/styles',
            ],
        },
        cssModules: {
            headerModules: [
                'osf-components/styles/headers',
            ],
        },
    },
};
