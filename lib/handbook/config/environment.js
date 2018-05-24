/* eslint-env node */

module.exports = function(environment) {
    const ENV = {
        modulePrefix: 'handbook',
        rootURL: '/',
        environment,

        'ember-cli-addon-docs': {
            docsApp: 'handbook',
            docsAppPath: 'lib/handbook/addon/',
            assetsUrlPath: '/engines-dist/handbook/',
            editDocPath: '/edit/develop/lib/handbook/addon/',
            editSourcePath: '/edit/develop/something/',
            documentedAddons: [
                'osf-components',
            ],
        },
    };

    if (environment === 'production') {
        // Allow ember-cli-addon-docs to update the rootURL in compiled assets
        ENV.rootURL = 'ADDON_DOCS_ROOT_URL';
    }

    return ENV;
};
