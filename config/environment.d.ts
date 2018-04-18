/**
 * Type declarations for
 *    import config from './config/environment'
 *
 * For now these need to be managed by the developer
 * since different ember addons can materialize new entries.
 */
declare const config: {
    environment: any;
    modulePrefix: string;
    podModulePrefix: string;
    locationType: string;
    rootURL: string;
    authorizationType: string;
    sentryDSN: string | null;
    sentryOptions: {
        release: string;
        ignoreErrors: string[];
    };
    'ember-simple-auth': {
        authorizer: string;
        authenticator: string;
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
    };
    moment: {
        includeTimezone: string;
        outputFormat: string;
    };
    metricsAdapters: Array<{
        name: string;
        environments: string[];
        config: {
            id: string;
        };
        dimensions: {
            string: string;
        };
    }>;
    FB_APP_ID: string;
    microfeedback: {
        enabled: boolean;
        url: string | null;
        pageParams: {
            QuickFiles: {};
        };
    };
    OSF: {
        clientId: string;
        scope: string;
        apiNamespace: string;
        backend: string;
        redirectUri: string;
        url: string;
        apiUrl: string;
        renderUrl: string;
        waterbutlerUrl: string;
        helpUrl: string;
        cookieLoginUrl: string;
        oauthUrl: string;
        shareBaseUrl: string;
        shareApiUrl: string;
        shareSearchUrl: string;
        accessToken: string;
        devMode: boolean;
        statusCookie: string;
        cookieDomain: string;
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
    featureFlags: {
        routes: {
            support: string;
            dashboard: string;
            home: string;
        };
    };
    gReCaptcha: {
        siteKey: string;
    };
    home: {
        youtubeId: string;
    };
};

export default config;
