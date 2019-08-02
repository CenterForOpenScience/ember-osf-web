/* eslint-env node */

// HACK: This violates the intended isolation of engines
const projectConfigFactory = require('../../../config/environment');

module.exports = function(environment) {
    const projectConfig = projectConfigFactory(environment);

    const ENV = {
        // Ember settings
        environment,
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            },
            EXTEND_PROTOTYPES: {
                // Prevent Ember Data from overriding Date.parse.
                Date: false,
            },
        },
        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
        },
        hostAppName: 'registries',
        modulePrefix: 'registries',

        // Addon settings
        'ember-cli-mirage': projectConfig['ember-cli-mirage'],

        // Engine specific settings
        shareBaseURL: 'https://share.osf.io',
        shareSearchBaseURL: 'https://share.osf.io/api/v2/search',
        indexPageRegistrationsQuery: '6tsnj OR aurjt OR e94t8 OR 2tpy9 OR 2ds52',
        sourcesWhitelist: [{
            display: 'OSF Registries',
            https: true,
            name: 'OSF',
            urlRegex: '^https?://(?:.*(?:staging\\d?|test)\\.)?osf\\.io.*$',
        }, {
            display: undefined,
            https: true,
            name: 'ClinicalTrials.gov',
            urlRegex: '^https?://.*clinicaltrials\\.gov.*$',
        }, {
            display: undefined,
            https: true,
            name: 'Research Registry',
            urlRegex: '^https?://.*researchregistry\\.com.*$',
        }],
        externalLinks: {
            help: 'https://openscience.zendesk.com/hc/en-us/categories/360001550953',
            donate: 'https://cos.io/donate',
        },
    };

    if (environment === 'test') {
        // Testem prefers this...
        ENV.locationType = 'none';

        // Test environment needs to find assets in the "regular" location.
        ENV.assetsPrefix = '/';

        // Always enable mirage for tests.
        ENV['ember-cli-mirage'].enabled = true;

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
        ENV.APP.autoboot = false;
    }

    return ENV;
};
