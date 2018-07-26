/**
 * Type declarations for
 *    import config from './config/environment'
 *
 * For now these need to be managed by the developer
 * since different ember addons can materialize new entries.
 */
declare const config: {
    environment: any;
    lintOnBuild: boolean;
    sourcemapsEnabled: boolean;
    modulePrefix: string;
    locationType: string;
    rootURL: string;
    assetsPrefix: string;
    sentryDSN: string | null;
    sentryOptions: {
        release?: string;
        ignoreErrors: string[];
    };
    EmberENV: {
        FEATURES: {};
        EXTEND_PROTOTYPES: {
            Date: boolean;
        };
    };
    APP: {};
    i18n: {
        defaultLocale: string;
        enabledLocales: string[];
    };
    moment: {
        includeTimezone: string;
        outputFormat: string;
    };
    metricsAdapters: Array<{
        name: string;
        environments: string[];
        config: {
            id?: string;
            cookieDomain?: string;
            setFields?: { [k: string]: any };
        };
        dimensions: {
            authenticated: string;
            resource: string;
            isPublic: string;
        };
    }>;
    FB_APP_ID?: string;
    microfeedback: {
        enabled: boolean;
        url: string | null;
        pageParams: { [index: string]: {
            componentID?: string;
            priorityID?: string;
        } | undefined };
    };
    OSF: {
        clientId?: string;
        scope?: string;
        apiNamespace: string;
        backend: string;
        redirectUri?: string;
        url: string;
        apiUrl: string;
        apiVersion: string;
        apiHeaders: { [k: string]: string };
        renderUrl: string;
        waterbutlerUrl: string;
        helpUrl: string;
        shareBaseUrl: string;
        shareApiUrl: string;
        shareSearchUrl: string;
        devMode: boolean;
        statusCookie: string;
        cookieDomain: string;
        authenticator: string;
        keenProjectId?: string;
        analyticsDismissAdblockCookie: string;
        cookies: {
            authSession: string;
        };
        localStorageKeys: {
            authSession: string;
        };
    };
    social: {
        twitter: {
            viaHandle: string;
        };
    };
    signUpPolicy: {
        termsLink: string;
        privacyPolicyLink: string;
        cookiesLink: string;
    };
    footerLinks: {
        cos: string,
        statusPage: string,
        apiDocs: string,
        topGuidelines: string,
        rpp: string,
        rpcb: string,
        twitter: string,
        facebook: string,
        googleGroup: string,
        github: string,
        googlePlus: string,
    },
    support: {
        preregUrl: string;
        statusPageUrl: string;
        faqPageUrl: string;
        supportEmail: string;
        contactEmail: string;
        consultationUrl: string;
        twitterUrl: string;
        mailingUrl: string;
        facebookUrl: string;
        githubUrl: string;
    };
    dashboard: {
        popularNode: string;
        noteworthyNode: string;
    };
    featureFlagNames: {
        routes: {
            [routeName: string]: string;
        };
        navigation: {
            institutions: string;
        };
        storageI18n: string;
    };
    gReCaptcha: {
        siteKey: string;
    };
    home: {
        youtubeId: string;
    };
    secondaryNavbarId: string;
    'ember-a11y-testing'?: {
        componentOptions: {
            turnAuditOff: boolean,
        },
    };
    'ember-cli-mirage'?: {
        enabled: boolean;
    };
    engines: {
        collections: {
            enabled: boolean;
        };
        handbook: {
            enabled: boolean;
            docGenerationEnabled: boolean;
        };
    };
    'ember-cli-tailwind'?: {
        shouldIncludeStyleguide: boolean,
    };
};

export default config;
