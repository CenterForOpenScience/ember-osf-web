/* eslint-env node */

// HACK: This violates the intended isolation of engines
const projectConfig = require('../../../config/environment');

module.exports = function(environment) {
    const config = projectConfig(environment);

    const { docGenerationEnabled } = config.engines.handbook;

    const ENV = {
        modulePrefix: 'handbook',
        rootURL: '/',
        environment,

        docGenerationEnabled,

        'ember-cli-addon-docs': {
            assetsUrlPath: `${config.assetsPrefix}engines-dist/handbook/`,
            docsApp: 'handbook',
            docsAppPath: 'lib/handbook/addon/',
            editDocPath: '/edit/develop/lib/handbook/addon/',
            // editSourcePath: '/edit/develop/something/',
            documentedAddons: docGenerationEnabled ? ['osf-components'] : [],
            disableGeneratedDocs: !docGenerationEnabled,
        },
    };

    return ENV;
};
