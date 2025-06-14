/* eslint-env node */
// Note: environment.d.ts is now in app/config

function isTruthy(val) {
    return ['true', '1'].includes(val.toString().toLowerCase());
}

let localConfig;

try {
    localConfig = require('./local'); // eslint-disable-line global-require,node/no-missing-require
} catch (ex) {
    localConfig = {};
}

const {
    A11Y_AUDIT = 'true',
    ASSETS_PREFIX: assetsPrefix = '/ember_osf_web/',
    BACKEND: backend = 'local',
    CAS_URL: casUrl = 'http://192.168.168.167:8080',
    CEDAR_CONFIG: cedarConfig = {
        viewerConfig: {
            showHeader: false,
            showFooter: false,
            expandedSampleTemplateLinks: false,
            showSampleTemplateLinks: false,
            defaultLanguage: 'en',
            showTemplateData: false,
            showInstanceData: false,
        },
        editorConfig: {
            defaultLanguage: 'en',
            expandedSampleTemplateLinks: true,
            showTemplateRenderingRepresentation: false,
            showMultiInstanceInfo: false,
            expandedInstanceDataFull: false,
            expandedInstanceDataCore: false,
            expandedMultiInstanceInfo: false,
            expandedTemplateRenderingRepresentation: false,
            expandedTemplateSourceData: false,
            collapseStaticComponents: false,
            showStaticText: false,
            showInstanceDataCore: false,
            showHeader: false,
            showFooter: false,
            terminologyIntegratedSearchUrl: 'https://terminology.metadatacenter.org/bioportal/integrated-search',
            // These are required to be false
            showInstanceDataFull: false,
            showTemplateSourceData: false,
        },
    },
    CLIENT_ID: clientId,
    COLLECTIONS_ENABLED = false,
    DATACITE_TRACKER_REPO_ID: dataciteTrackerRepoId = '',
    DATACITE_TRACKER_URL: dataCiteTrackerUrl = 'https://analytics.datacite.org/api/metric',
    REGISTRIES_ENABLED = true,
    TESTS_ENABLED = false,
    FB_APP_ID,
    GIT_COMMIT: release,
    GOOGLE_ANALYTICS_ID,
    GOOGLE_TAG_MANAGER_ID,
    KEEN_CONFIG: keenConfig,
    LINT_ON_BUILD: lintOnBuild = false,
    WATER_BUTLER_ENABLED = true,
    MIRAGE_ENABLED = false,
    MIRAGE_SCENARIOS = [
        'cedar',
        'collections',
        'dashboard',
        'forks',
        'loggedIn',
        'meetings',
        'preprints',
        'registrations',
        'settings',
    ],
    OAUTH_SCOPES: scope,
    OSF_STATUS_COOKIE: statusCookie = 'osf_status',
    OSF_COOKIE_DOMAIN: cookieDomain = 'localhost',
    OSF_URL: url = 'http://localhost:5000/',
    OSF_API_URL: apiUrl = 'http://localhost:8000',
    OSF_API_VERSION: apiVersion = '2.20',
    OSF_RENDER_URL: renderUrl = 'http://localhost:7778/render',
    OSF_MFR_URL: mfrUrl = 'http://localhost:4200',
    OSF_FILE_URL: waterbutlerUrl = 'http://localhost:7777/',
    // TODO: where shold this actually go?
    ADDON_SERVICE_URL: addonServiceUrl = 'http://localhost:8004/',
    OSF_HELP_URL: helpUrl = 'http://localhost:4200/help',
    OSF_AUTHENTICATOR: osfAuthenticator = 'osf-cookie',
    PLAUDIT_WIDGET_URL: plauditWidgetUrl = 'https://osf-review.plaudit.pub/embed/endorsements.js',
    METRICS_START_DATE: metricsStartDate = '2019-01-01',
    POLICY_URL_PREFIX = 'https://github.com/CenterForOpenScience/centerforopenscience.org/blob/master/',
    POPULAR_LINKS_NODE: popularNode = '57tnq',
    // POPULAR_LINKS_REGISTRATIONS = '',
    NEW_AND_NOTEWORTHY_LINKS_NODE: noteworthyNode = 'z3sg2',
    /* eslint-disable-next-line max-len */
    // https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha-v2-what-should-i-do
    RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    REDIRECT_URI: redirectUri,
    ROOT_URL: rootURL = '/',
    SHARE_BASE_URL: shareBaseUrl = 'http://localhost:8003/',
    SHARE_SEARCH_URL: shareSearchUrl = 'http://localhost:8003/api/v2/search/creativeworks/_search',
    SOURCEMAPS_ENABLED: sourcemapsEnabled = true,
    SHOW_DEV_BANNER = false,

    GOOGLE_FILE_PICKER_SCOPES,
    /* eslint-disable-next-line max-len */
    GOOGLE_FILE_PICKER_CLIENT_ID,
    GOOGLE_FILE_PICKER_API_KEY,
    GOOGLE_FILE_PICKER_APP_ID,

} = { ...process.env, ...localConfig };

module.exports = function(environment) {
    const devMode = environment !== 'production';

    const ENV = {
        modulePrefix: 'ember-osf-web',
        cedarConfig,
        WATER_BUTLER_ENABLED,
        plauditWidgetUrl,
        environment,
        lintOnBuild,
        testsEnabled: false, // Disable tests by default.
        sourcemapsEnabled,
        showDevBanner: isTruthy(SHOW_DEV_BANNER),
        rootURL,
        assetsPrefix,
        locationType: 'auto',
        sentryDSN: null,
        googleTagManagerId: null,
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
        moment: {
            includeTimezone: 'all',
            outputFormat: 'YYYY-MM-DD h:mm A z',
        },
        metricsAdapters: [
            {
                name: 'GoogleAnalytics',
                environments: GOOGLE_ANALYTICS_ID ? ['all'] : [],
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
                    isWithdrawn: 'dimension4',
                    version: 'dimension5',
                },
            },
            {
                name: 'GoogleTagManager',
                environments: GOOGLE_TAG_MANAGER_ID ? ['all'] : [],
                config: {
                    id: GOOGLE_TAG_MANAGER_ID,
                },
            },
        ],
        FB_APP_ID,
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
                Accept: `application/vnd.api+json; version=${apiVersion}`,
            },
            learnMoreUrl: 'https://cos.io/our-products/osf/',
            donateUrl: 'https://cos.io/donate',
            renderUrl,
            mfrUrl,
            waterbutlerUrl,
            addonServiceUrl,
            helpUrl,
            shareBaseUrl,
            shareSearchUrl,
            devMode,
            metricsStartDate,
            cookieDomain,
            authenticator: `authenticator:${osfAuthenticator}`,
            cookies: {
                status: statusCookie,
                keenUserId: 'keenUserId',
                keenSessionId: 'keenSessionId',
                cookieConsent: 'osf_cookieconsent',
                newFeaturePopover: 'metadataFeaturePopover',
                maintenance: 'maintenance',
                csrf: 'api-csrf',
                authSession: 'embosf-auth-session',
            },
            localStorageKeys: {
                authSession: 'embosf-auth-session',
                joinBannerDismissed: 'slide', // TODO: update legacy UI to use a more unique key
            },
            casUrl,
            analyticsAttrs: {
                name: 'data-analytics-name',
                scope: 'data-analytics-scope',
                extra: 'data-analytics-extra',
                category: 'data-analytics-category',
                action: 'data-analytics-action',
            },
            doiUrlPrefix: 'https://doi.org/',
            dataciteTrackerRepoId,
            dataCiteTrackerUrl,
            googleFilePicker: {
                GOOGLE_FILE_PICKER_SCOPES,
                GOOGLE_FILE_PICKER_CLIENT_ID,
                GOOGLE_FILE_PICKER_API_KEY,
                GOOGLE_FILE_PICKER_APP_ID,
            },
        },
        social: {
            twitter: {
                viaHandle: 'OSFramework',
            },
        },
        signUpPolicy: {
            termsLink: 'https://osf.io/terms_of_use/',
            privacyPolicyLink: 'https://osf.io/privacy_policy/',
            cookiesLink: 'https://osf.io/privacy_policy/#f-cookies',
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
        },
        support: {
            preregUrl: 'https://cos.io/prereg/',
            statusPageUrl: 'https://status.cos.io',
            faqPageUrl: 'https://help.osf.io',
            supportEmail: 'support@osf.io',
            contactEmail: 'contact@osf.io',
            consultationUrl: 'https://cos.io/stats_consulting/',
            twitterUrl: 'https://twitter.com/OSFSupport',
            mailingUrl: 'https://groups.google.com/forum/#!forum/openscienceframework',
            facebookUrl: 'https://www.facebook.com/CenterForOpenScience/',
            githubUrl: 'https://github.com/centerforopenscience',
        },
        helpLinks: {
            linkToAProject: 'https://help.osf.io/hc/en-us/articles/360019930313-Link-to-a-Project',
        },
        dashboard: {
            popularNode,
            noteworthyNode,
        },
        featureFlagNames: {
            routes: {
                'collections.moderation': 'collections_moderation',
                'registries.branded': 'branded_registries',
                'registries.branded.discover': 'branded_registries',
                'guid-node.index': 'ember_project_detail_page',
                'guid-node.drafts.index': 'ember_edit_draft_registration_page',
                'guid-node.drafts.register': 'ember_edit_draft_registration_page',
                'guid-node.addons': 'gravy_waffle',
                'guid-user.index': 'ember_user_profile_page',
                'guid-registration.index': 'ember_old_registration_detail_page',
                settings: 'ember_user_settings_page',
                'settings.profile': 'ember_user_settings_page',
                'settings.profile.education': 'ember_user_settings_page',
                'settings.profile.employment': 'ember_user_settings_page',
                'settings.profile.name': 'ember_user_settings_page',
                'settings.profile.social': 'ember_user_settings_page',
                'settings.account': 'ember_user_settings_account_page',
                'settings.tokens': 'ember_user_settings_tokens_page',
                'settings.tokens.index': 'ember_user_settings_tokens_page',
                'settings.tokens.create': 'ember_user_settings_tokens_page',
                'settings.tokens.edit': 'ember_user_settings_tokens_page',
                'settings.developer-apps': 'ember_user_settings_apps_page',
                'settings.developer-apps.index': 'ember_user_settings_apps_page',
                'settings.developer-apps.create': 'ember_user_settings_apps_page',
                'settings.developer-apps.edit': 'ember_user_settings_apps_page',
                'settings.addons': 'gravy_waffle',
                register: 'ember_auth_register',
                'registries.overview': 'ember_registries_detail_page',
                'registries.overview.index': 'ember_registries_detail_page',
                'registries.overview.comments': 'ember_registries_detail_page',
                'registries.overview.contributors': 'ember_registries_detail_page',
                'registries.overview.children': 'ember_registries_detail_page',
                'registries.overview.links': 'ember_registries_detail_page',
                'registries.start': 'ember_registries_submission_start',
                'registries.drafts': 'ember_registries_submission_drafts',
                'registries.drafts.index': 'ember_registries_submission_drafts',
                'registries.drafts.draft.metadata': 'ember_edit_draft_registration_page',
                'registries.drafts.draft.page': 'ember_edit_draft_registration_page',
                'registries.drafts.draft.review': 'ember_edit_draft_registration_page',
                'registries.forms': 'ember_registries_submission_forms',
                'registries.forms.help': 'ember_registries_submission_forms',
                'meetings.index': 'ember_meetings_page',
                'meetings.detail': 'ember_meeting_detail_page',
            },
            navigation: {
                institutions: 'institutions_nav_bar',
            },
            storageI18n: 'storage_i18n',
            gravyWaffle: 'gravy_waffle',
            manualDoiAndGuid: 'manual_doi_and_guid',
            enableInactiveSchemas: 'enable_inactive_schemas',
            verifyEmailModals: 'ember_verify_email_modals',
            ABTesting: {
                homePageHeroTextVersionB: 'ab_testing_home_page_hero_text_version_b',
            },
            registrationFilesPage: 'ember_registration_files_page',
            egapAdmins: 'egap_admins',
            shareDownload: 'share_download',
        },
        gReCaptcha: {
            siteKey: RECAPTCHA_SITE_KEY,
        },
        home: {
            youtubeId: '2TV21gOzfhw',
        },
        secondaryNavbarId: '__secondaryOSFNavbar__',
        engines: {
            // App Engines should always be enabled in production builds
            // as they will be enabled/disabled at runtime rather than buildtime
            collections: {
                enabled: !devMode || isTruthy(COLLECTIONS_ENABLED),
            },
            registries: {
                enabled: !devMode || isTruthy(REGISTRIES_ENABLED),
            },
        },
        'ember-cli-tailwind': {
            shouldIncludeStyleguide: false,
        },
        'ember-cli-mirage': {
            enabled: isTruthy(MIRAGE_ENABLED),
        },
        'changeset-validations': {
            rawOutput: true,
        },
        mirageScenarios: MIRAGE_SCENARIOS,

        defaultProvider: 'osf',
        pageTitle: {
            prepend: false,
        },
    };

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;

        ENV.metricsAdapters[0].config.cookieDomain = 'none';
        ENV.APP.LOG_TRANSITIONS = true;
        ENV.APP.LOG_TRANSITIONS_INTERNAL = true;

        Object.assign(ENV, {
            'ember-a11y-testing': {
                componentOptions: {
                    turnAuditOff: !isTruthy(A11Y_AUDIT),
                },
            },
            // Conditionally enable tests in development environment.
            testsEnabled: isTruthy(TESTS_ENABLED),
            showDevBanner: true,
        });
    }

    if (environment === 'test') {
        Object.assign(ENV, {
            // Testem prefers this...
            locationType: 'none',
            // Test environment needs to find assets in the "regular" location.
            assetsPrefix: '/',
            // Always enable tests in test environment.
            testsEnabled: true,
            // Always enable mirage for tests.
            'ember-cli-mirage': {
                enabled: true,
            },
            APP: {
                ...ENV.APP,
                // keep test console output quieter
                LOG_ACTIVE_GENERATION: false,
                LOG_VIEW_LOOKUPS: false,
                rootElement: '#ember-testing',
                autoboot: false,
            },
            engines: {
                ...ENV.engines,
                collections: {
                    enabled: true,
                },
                registries: {
                    enabled: true,
                },
            },
        });
    }

    if (devMode) {
        // Fallback to throwaway defaults if the environment variables are not set
        ENV.metricsAdapters[0].config.id = ENV.metricsAdapters[0].config.id || 'UA-84580271-1';
        ENV.FB_APP_ID = ENV.FB_APP_ID || '1039002926217080';
    }

    return ENV;
};
