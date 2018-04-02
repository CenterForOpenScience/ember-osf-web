/* eslint-env node */

let localConfig;

try {
    localConfig = require('./local'); // eslint-disable-line global-require
} catch (ex) {
    localConfig = {};
}

const {
    A11Y_AUDIT = 'true',
    BACKEND: backend = 'local',
    CLIENT_ID: clientId,
    FB_APP_ID,
    GIT_COMMIT: release,
    GOOGLE_ANALYTICS_ID,
    OAUTH_SCOPES: scope,
    OSF_URL: url = 'http://localhost:5000/',
    OSF_API_URL: apiUrl = 'http://localhost:8000',
    OSF_RENDER_URL: renderUrl = 'http://localhost:7778/render',
    OSF_FILE_URL: waterbutlerUrl = 'http://localhost:7777/',
    OSF_HELP_URL: helpUrl = 'http://localhost:4200/help',
    OSF_COOKIE_LOGIN_URL: cookieLoginUrl = 'http://localhost:8080/login',
    OSF_OAUTH_URL: oauthUrl = 'http://localhost:8080/oauth2/profile',
    PERSONAL_ACCESS_TOKEN: accessToken,
    POLICY_URL_PREFIX = 'https://github.com/CenterForOpenScience/centerforopenscience.org/blob/master/',
    POPULAR_LINKS_NODE: popularNode = '57tnq',
    // POPULAR_LINKS_REGISTRATIONS = '',
    NEW_AND_NOTEWORTHY_LINKS_NODE: noteworthyNode = 'z3sg2',
    RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha-v2-what-should-i-do
    REDIRECT_URI: redirectUri,
    SHARE_BASE_URL: shareBaseUrl = 'https://staging-share.osf.io/',
    SHARE_API_URL: shareApiUrl = 'https://staging-share.osf.io/api/v2',
    SHARE_SEARCH_URL: shareSearchUrl = 'https://staging-share.osf.io/api/v2/search/creativeworks/_search',
} = { ...process.env, ...localConfig };

module.exports = function(environment) {
    const authorizationType = 'cookie';
    const devMode = environment !== 'production';

    const ENV = {
        modulePrefix: 'ember-osf-web',
        environment,
        rootURL: '/',
        locationType: 'auto',
        authorizationType,
        sentryDSN: null,
        sentryOptions: {
            release,
        },
        'ember-simple-auth': {
            authorizer: `authorizer:osf-${authorizationType}`,
            authenticator: `authenticator:osf-${authorizationType}`,
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
            renderUrl,
            waterbutlerUrl,
            helpUrl,
            cookieLoginUrl,
            oauthUrl,
            shareBaseUrl,
            shareApiUrl,
            shareSearchUrl,
            accessToken,
            devMode,
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
        featureFlags: { // default flags (whether they be switches, flags, or polls) go here with default value.
            routes: {
                support: 'ember_support_page',
                dashboard: 'ember_home_page',
                home: 'ember_home_page',
            },
        },
        gReCaptcha: {
            siteKey: RECAPTCHA_SITE_KEY,
        },
        home: {
            youtubeId: '2TV21gOzfhw',
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
        });
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
    }

    if (devMode) {
        // Fallback to throwaway defaults if the environment variables are not set
        ENV.metricsAdapters[0].config.id = ENV.metricsAdapters[0].config.id || 'UA-84580271-1';
        ENV.FB_APP_ID = ENV.FB_APP_ID || '1039002926217080';
    }

    return ENV;
};
