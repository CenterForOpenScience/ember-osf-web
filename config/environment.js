/* eslint-env node */

let localConfig;

try {
    localConfig = require('./local'); // eslint-disable-line global-require
} catch (ex) {
    localConfig = {};
}

const {
    A11Y_AUDIT = 'true',
    ASSETS_PREFIX: assetsPrefix = '/ember_osf_web/',
    BACKEND: backend = 'local',
    CLIENT_ID: clientId,
    ENABLED_LOCALES = 'en, en-US',
    COLLECTIONS_ENABLED = false,
    HANDBOOK_ENABLED = false,
    HANDBOOK_DOC_GENERATION_ENABLED = false,
    FB_APP_ID,
    FEATURE_FLAGS: featureFlags,
    GIT_COMMIT: release,
    GOOGLE_ANALYTICS_ID,
    KEEN_PROJECT_ID: keenProjectId,
    LINT_ON_BUILD: lintOnBuild = false,
    MIRAGE_ENABLED = false,
    OAUTH_SCOPES: scope,
    OSF_STATUS_COOKIE: statusCookie = 'osf_status',
    OSF_COOKIE_DOMAIN: cookieDomain = 'localhost',
    OSF_URL: url = 'http://localhost:5000/',
    OSF_API_URL: apiUrl = 'http://localhost:8000',
    OSF_API_VERSION: apiVersion = '2.8',
    OSF_RENDER_URL: renderUrl = 'http://localhost:7778/render',
    OSF_FILE_URL: waterbutlerUrl = 'http://localhost:7777/',
    OSF_HELP_URL: helpUrl = 'http://localhost:4200/help',
    OSF_AUTHENTICATOR: osfAuthenticator = 'osf-cookie',
    POLICY_URL_PREFIX = 'https://github.com/CenterForOpenScience/centerforopenscience.org/blob/master/',
    POPULAR_LINKS_NODE: popularNode = '57tnq',
    // POPULAR_LINKS_REGISTRATIONS = '',
    NEW_AND_NOTEWORTHY_LINKS_NODE: noteworthyNode = 'z3sg2',
    /* eslint-disable-next-line max-len */
    // https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha-v2-what-should-i-do
    RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    REDIRECT_URI: redirectUri,
    SHARE_BASE_URL: shareBaseUrl = 'https://staging-share.osf.io/',
    SHARE_API_URL: shareApiUrl = 'https://staging-share.osf.io/api/v2',
    SHARE_SEARCH_URL: shareSearchUrl = 'https://staging-share.osf.io/api/v2/search/creativeworks/_search',
    SOURCEMAPS_ENABLED: sourcemapsEnabled = false,
} = { ...process.env, ...localConfig };

module.exports = function(environment) {
    const devMode = environment !== 'production';

    const ENV = {
        modulePrefix: 'ember-osf-web',
        environment,
        lintOnBuild,
        sourcemapsEnabled,
        rootURL: '/',
        assetsPrefix,
        locationType: 'auto',
        sentryDSN: null,
        sentryOptions: {
            release,
            ignoreErrors: [
                // https://github.com/emberjs/ember.js/issues/12505
                'TransitionAborted',
            ],
        },
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
        i18n: {
            defaultLocale: 'en-US',
            enabledLocales: ENABLED_LOCALES.split(/[, ]+/),
        },
        moment: {
            includeTimezone: 'all',
            outputFormat: 'YYYY-MM-DD h:mm A z',
        },
        metricsAdapters: [
            {
                name: 'GoogleAnalytics',
                environments: ['all'],
                config: {
                    id: GOOGLE_ANALYTICS_ID,
                    setFields: {
                        anonymizeIp: true,
                    },
                },
                dimensions: {
                    authenticated: 'dimension1',
                    resource: 'dimension2',
                    isPublic: 'dimension3',
                },
            },
        ],
        FB_APP_ID,
        microfeedback: {
            enabled: true,
            url: null,
            pageParams: {
                // Mapping of pageName to query params to add
                // to the base MicroFeedback URL
                // e.g. {
                //    QuickFiles: {
                //        componentID: '13836',
                //        priorityID: '10100',
                //    }
                // }
                QuickFiles: {},
            },
        },
        OSF: {
            clientId,
            scope,
            apiNamespace: 'v2', // URL suffix (after host)
            backend,
            redirectUri,
            url,
            apiUrl,
            apiVersion,
            apiHeaders: {
                ACCEPT: `application/vnd.api+json; version=${apiVersion}`,
            },
            renderUrl,
            waterbutlerUrl,
            helpUrl,
            shareBaseUrl,
            shareApiUrl,
            shareSearchUrl,
            devMode,
            statusCookie,
            cookieDomain,
            authenticator: `authenticator:${osfAuthenticator}`,
            keenProjectId,
            analyticsDismissAdblockCookie: 'adBlockDismiss',
        },
        social: {
            twitter: {
                viaHandle: 'OSFramework',
            },
        },
        signUpPolicy: {
            termsLink: `${POLICY_URL_PREFIX}TERMS_OF_USE.md`,
            privacyPolicyLink: `${POLICY_URL_PREFIX}PRIVACY_POLICY.md`,
            cookiesLink: `${POLICY_URL_PREFIX}PRIVACY_POLICY.md#f-cookies`,
        },
        footerLinks: {
            cos: 'https://cos.io',
            statusPage: 'https://status.cos.io/',
            apiDocs: 'https://developer.osf.io/',
            topGuidelines: 'http://cos.io/top/',
            rpp: 'https://osf.io/ezcuj/wiki/home/',
            rpcb: 'https://osf.io/e81xl/wiki/home/',
            twitter: 'http://twitter.com/OSFramework',
            facebook: 'https://www.facebook.com/CenterForOpenScience/',
            googleGroup: 'https://groups.google.com/forum/#!forum/openscienceframework',
            github: 'https://www.github.com/centerforopenscience',
            googlePlus: 'https://plus.google.com/b/104751442909573665859',
        },
        support: {
            preregUrl: 'https://cos.io/prereg/',
            statusPageUrl: 'https://status.cos.io',
            faqPageUrl: 'http://help.osf.io/m/faqs/l/726460-faqs',
            supportEmail: 'support@osf.io',
            contactEmail: 'contact@osf.io',
            consultationUrl: 'https://cos.io/stats_consulting/',
            twitterUrl: 'https://twitter.com/OSFSupport',
            mailingUrl: 'https://groups.google.com/forum/#!forum/openscienceframework',
            facebookUrl: 'https://www.facebook.com/CenterForOpenScience/',
            githubUrl: 'https://github.com/centerforopenscience',
        },
        dashboard: {
            popularNode,
            noteworthyNode,
        },
        featureFlags,
        featureFlagNames: {
            routes: {
                support: 'ember_support_page',
                dashboard: 'ember_home_page',
                home: 'ember_home_page',
                'guid-node.forks': 'ember_project_forks_page',
                'guid-registration.forks': 'ember_project_forks_page',
                'guid-node.analytics.index': 'ember_project_analytics_page',
                'guid-registration.analytics.index': 'ember_project_analytics_page',
            },
            navigation: {
                institutions: 'institutions_nav_bar',
            },
            storageI18n: 'storage_i18n',
        },
        gReCaptcha: {
            siteKey: RECAPTCHA_SITE_KEY,
        },
        home: {
            youtubeId: '2TV21gOzfhw',
        },
        secondaryNavbarId: '__secondaryOSFNavbar__',
        engines: {
            collections: {
                enabled: COLLECTIONS_ENABLED,
            },
            handbook: {
                enabled: HANDBOOK_ENABLED,
                docGenerationEnabled: HANDBOOK_DOC_GENERATION_ENABLED,
            },
        },
        'ember-cli-tailwind': {
            shouldIncludeStyleguide: false,
        },
    };

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;

        ENV.metricsAdapters[0].config.cookieDomain = 'none';

        Object.assign(ENV, {
            'ember-a11y-testing': {
                componentOptions: {
                    turnAuditOff: A11Y_AUDIT !== 'true',
                },
            },
            'ember-cli-mirage': {
                enabled: Boolean(MIRAGE_ENABLED),
            },
        });
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.locationType = 'none';

        // Test environment needs to find assets in the "regular" location.
        ENV.assetsPrefix = '/';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
        ENV.APP.autoboot = false;
    }

    if (devMode) {
        // Fallback to throwaway defaults if the environment variables are not set
        ENV.metricsAdapters[0].config.id = ENV.metricsAdapters[0].config.id || 'UA-84580271-1';
        ENV.FB_APP_ID = ENV.FB_APP_ID || '1039002926217080';
    }

    return ENV;
};
