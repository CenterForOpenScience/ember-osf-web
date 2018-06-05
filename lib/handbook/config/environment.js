/* eslint-env node */

// HACK: This violates the intended isolation of engines
const projectConfig = require('../../../config/environment');

module.exports = function(environment) {
    const { docGenerationEnabled } = projectConfig(environment).engines.handbook;

    const ENV = {
        modulePrefix: 'handbook',
        rootURL: '/',
        environment,

        docGenerationEnabled,

        'ember-cli-addon-docs': {
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
