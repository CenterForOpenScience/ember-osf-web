/* eslint-env node */
const knownBackends = {
    local: {
        url: 'http://localhost:5000/',
        apiUrl: 'http://localhost:8000',
        renderUrl: 'http://localhost:7778/render',
        waterbutlerUrl: 'http://localhost:7777/',
        helpUrl: 'http://localhost:4200/help',
        cookieLoginUrl: 'http://localhost:8080/login',
        oauthUrl: 'http://localhost:8080/oauth2/profile',
        shareBaseUrl: 'https://staging-share.osf.io/',
        shareApiUrl: 'https://staging-share.osf.io/api/v2',
        shareSearchUrl: 'https://staging-share.osf.io/api/v2/search/creativeworks/_search',
    },
    stage: {
        url: 'https://staging.osf.io/',
        apiUrl: 'https://staging-api.osf.io',
        renderUrl: 'https://staging-mfr.osf.io/render',
        waterbutlerUrl: 'https://staging-files.osf.io/',
        helpUrl: 'http://help.osf.io',
        cookieLoginUrl: 'https://staging-accounts.osf.io/login',
        oauthUrl: 'https://staging-accounts.osf.io/oauth2/authorize',
        shareBaseUrl: 'https://staging-share.osf.io/',
        shareApiUrl: 'https://staging-share.osf.io/api/v2',
        shareSearchUrl: 'https://staging-share.osf.io/api/v2/search/creativeworks/_search',
    },
    stage2: {
        url: 'https://staging2.osf.io/',
        apiUrl: 'https://staging2-api.osf.io',
        renderUrl: 'https://staging2-mfr.osf.io/render',
        waterbutlerUrl: 'https://staging2-files.osf.io/',
        helpUrl: 'http://help.osf.io',
        cookieLoginUrl: 'https://staging2-accounts.osf.io/login',
        oauthUrl: 'https://staging2-accounts.osf.io/oauth2/authorize',
        shareBaseUrl: 'https://staging-share.osf.io/',
        shareApiUrl: 'https://staging-share.osf.io/api/v2',
        shareSearchUrl: 'https://staging-share.osf.io/api/v2/search/creativeworks/_search',
    },
    stage3: {
        url: 'https://staging3.osf.io/',
        apiUrl: 'https://staging3-api.osf.io',
        renderUrl: 'https://staging3-mfr.osf.io/render',
        waterbutlerUrl: 'https://staging3-files.osf.io/',
        helpUrl: 'http://help.osf.io',
        cookieLoginUrl: 'https://staging3-accounts.osf.io/login',
        oauthUrl: 'https://staging3-accounts.osf.io/oauth2/authorize',
        shareBaseUrl: 'https://staging-share.osf.io/',
        shareApiUrl: 'https://staging-share.osf.io/api/v2',
        shareSearchUrl: 'https://staging-share.osf.io/api/v2/search/creativeworks/_search',
    },
    prod: {
        url: 'https://osf.io/',
        apiUrl: 'https://api.osf.io',
        renderUrl: 'https://mfr.osf.io/render',
        waterbutlerUrl: 'https://files.osf.io/',
        helpUrl: 'http://help.osf.io',
        cookieLoginUrl: 'https://accounts.osf.io/login',
        oauthUrl: 'https://accounts.osf.io/oauth2/authorize',
        shareBaseUrl: 'https://share.osf.io/',
        shareApiUrl: 'https://share.osf.io/api/v2',
        shareSearchUrl: 'https://share.osf.io/api/v2/search/creativeworks/_search',
    },
    test: {
        url: 'https://test.osf.io/',
        apiUrl: 'https://test-api.osf.io',
        renderUrl: 'https://test-mfr.osf.io/render',
        waterbutlerUrl: 'https://test-files.osf.io/',
        helpUrl: 'http://help.osf.io',
        cookieLoginUrl: 'https://test-accounts.osf.io/login',
        oauthUrl: 'https://test-accounts.osf.io/oauth2/authorize',
        shareBaseUrl: 'https://staging-share.osf.io/',
        shareApiUrl: 'https://staging-share.osf.io/api/v2',
        shareSearchUrl: 'https://staging-share.osf.io/api/v2/search/creativeworks/_search',
    },
    env: {
        url: 'OSF_URL',
        apiUrl: 'OSF_API_URL',
        renderUrl: 'OSF_RENDER_URL',
        waterbutlerUrl: 'OSF_FILE_URL',
        helpUrl: 'OSF_HELP_URL',
        cookieLoginUrl: 'OSF_COOKIE_LOGIN_URL',
        oauthUrl: 'OSF_OAUTH_URL',
        shareBaseUrl: 'SHARE_BASE_URL',
        shareApiUrl: 'SHARE_API_URL',
        shareSearchUrl: 'SHARE_SEARCH_URL',
    },
};

module.exports = function(environment) {
    const authorizationType = 'cookie';

    const ENV = {
        modulePrefix: 'ember-osf-web',
        environment,
        rootURL: '/',
        locationType: 'auto',
        authorizationType,
        sentryDSN: null,
        sentryOptions: {
            release: process.env.GIT_COMMIT,
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
        moment: {
            includeTimezone: 'all',
            outputFormat: 'YYYY-MM-DD h:mm A z',
        },
        metricsAdapters: [
            {
                name: 'GoogleAnalytics',
                environments: ['all'],
                config: {
                    id: process.env.GOOGLE_ANALYTICS_ID,
                },
            },
        ],
        FB_APP_ID: process.env.FB_APP_ID,
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
    };

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;

        ENV.metricsAdapters[0].config.cookieDomain = 'none';
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
    }

    if (environment !== 'production') {
        // Fallback to throwaway defaults if the environment variables are not set
        ENV.metricsAdapters[0].config.id = ENV.metricsAdapters[0].config.id || 'UA-84580271-1';
        ENV.FB_APP_ID = ENV.FB_APP_ID || '1039002926217080';
    }
    const BACKEND = process.env.BACKEND || 'local';
    // Settings required to configure the developer application, primarily for OAuth2
    // For i18n
    ENV.i18n = {
        defaultLocale: 'en-US',
    };

    ENV.OSF = {
        clientId: 'a7e9fe600d764985b6dcfd21389e470b',
        scope: 'osf.full_write',
        apiNamespace: 'v2', // URL suffix (after host)
        backend: BACKEND,
        redirectUri: 'http://localhost:4200/login',
    };

    // Fetch configuration information for the application
    let backendUrlConfig = knownBackends[BACKEND] || {};

    if (!Object.keys(knownBackends).includes(BACKEND)) {
        console.warn('WARNING: You have specified an unknown backend environment. If you need to customize URL settings, specify BACKEND=env');
    }

    if (BACKEND === 'local') {
        backendUrlConfig.accessToken = '02QoOzxEGu4uob4kzJsNe9O6dSgtfi3NPEXKiFhvcAPkr8y19fngVHzcccMFzFDiKcxXiZ';
        backendUrlConfig.isLocal = true;
    } else if (BACKEND === 'prod') {
        console.warn("WARNING: you've specified production as a backend. Please do not use production for testing or development purposes");
    } else if (BACKEND === 'env') {
        // Optionally draw backend URL settings entirely from environment variables.
        //   This is all or nothing: If you want to specify a custom backend, you must provide ALL URLs.
        const newConfig = {};
        // Map internal config names to the corresponding env var names, eg {url: OSF_URL}. All keys must be present
        Object.keys(backendUrlConfig).forEach((internalName) => {
            const envVarName = backendUrlConfig[internalName];
            newConfig[internalName] = envVarName;
        });
        backendUrlConfig = newConfig;
    }
    // Warn the user if some URL entries not present
    Object.keys(backendUrlConfig).forEach((key) => {
        if (!backendUrlConfig[key]) console.error(`This backend must define a value for: ${key}`);
    });

    // Combine URLs + auth settings into final auth config
    Object.assign(ENV.OSF, backendUrlConfig);

    const defaultAuthorizationType = 'cookie';
    ENV.authorizationType = defaultAuthorizationType;

    ENV['ember-simple-auth'] = {
        authorizer: `authorizer:osf-${defaultAuthorizationType}`,
        authenticator: `authenticator:osf-${defaultAuthorizationType}`,
    };
    return ENV;
};
