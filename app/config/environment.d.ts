/**
 * Type declarations for
 *    import config from './config/environment'
 *
 * For now these need to be managed by the developer
 * since different ember addons can materialize new entries.
 */

export interface KeenConfig {
    public?: {
        projectId: string;
        writeKey: string;
    };
    private?: {
        projectId: string;
        writeKey: string;
    };
}

declare const config: {
    WATER_BUTLER_ENABLED: boolean;
    plauditWidgetUrl: string,
    environment: any;
    cedarConfig: any;
    lintOnBuild: boolean;
    testsEnabled: boolean;
    sourcemapsEnabled: boolean;
    showDevBanner: boolean;
    modulePrefix: string;
    locationType: string;
    rootURL: string;
    assetsPrefix: string;
    sentryDSN: string | null;
    googleTagManagerId: string | null;
    cedarConfig: {
        viewerConfig: {
            showHeader: boolean,
            showFooter: boolean,
            expandedSampleTemplateLinks: boolean,
            showSampleTemplateLinks: boolean,
            defaultLanguage: string,
            showTemplateData: boolean,
            showInstanceData: boolean,
        }
        editorConfig: {
            sampleTemplateLocationPrefix: string,
            loadSampleTemplateName: string,
            expandedSampleTemplateLinks: boolean,
            showTemplateRenderingRepresentation: boolean,
            showMultiInstanceInfo: boolean,
            expandedInstanceDataFull: boolean,
            expandedInstanceDataCore: boolean,
            expandedMultiInstanceInfo: boolean,
            expandedTemplateRenderingRepresentation: boolean,
            showInstanceDataFull: boolean,
            showTemplateSourceData: boolean,
            expandedTemplateSourceData: boolean,
            collapseStaticComponents: boolean,
            showStaticText: boolean,
            showInstanceDataCore: boolean,
            showHeader: boolean,
            showFooter: boolean,
            showInstanceDataFull: boolean,
            showTemplateSourceData: boolean,
            terminologyIntegratedSearchUrl: string,
        },
    }
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
    moment: {
        includeTimezone: string;
        outputFormat: string;
    };
    metricsAdapters: Array<{
        name: string;
        environments: string[];
        config: any;
        dimensions?: {
            authenticated: string;
            resource: string;
            isPublic: string;
            isWithdrawn: string;
            version: string;
        };
    }>;
    FB_APP_ID?: string;
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
        learnMoreUrl: string;
        donateUrl: string;
        renderUrl: string;
        mfrUrl: string;
        addonServiceUrl: string;
        waterbutlerUrl: string;
        helpUrl: string;
        shareBaseUrl: string;
        shareSearchUrl: string;
        devMode: boolean;
        cookieDomain: string;
        authenticator: string;
        metricsStartDate: string;
        cookies: {
            status: string;
            keenUserId: string;
            keenSessionId: string;
            cookieConsent: string;
            newFeaturePopover: string;
            maintenance: string;
            csrf: string;
            authSession: string;
        };
        localStorageKeys: {
            authSession: string;
            joinBannerDismissed: string;
        };
        casUrl: string;
        analyticsAttrs: {
            name: string;
            scope: string;
            category: string;
            extra: string;
            action: string;
        };
        doiUrlPrefix: string;
        dataciteTrackerRepoId: string;
        dataCiteTrackerUrl: string;
        googleFilePicker: {
            GOOGLE_FILE_PICKER_SCOPES: string;
            GOOGLE_FILE_PICKER_CLIENT_ID: string;
            GOOGLE_FILE_PICKER_API_KEY: string;
            GOOGLE_FILE_PICKER_APP_ID: number;
        }
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
    helpLinks: {
        linkToAProject: string;
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
        ABTesting: {
            homePageHeroTextVersionB: string;
        };
        storageI18n: string;
        gravyWaffle: string;
        enableInactiveSchemas: string;
        registrationFilesPage: string;
        verifyEmailModals: string;
        egapAdmins: string;
        shareDownload: string;
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
    'ember-cli-mirage': {
        enabled: boolean;
    };
    'changeset-validations': {
        rawOutput?: boolean,
    };

    mirageScenarios: string[];

    engines: {
        collections: {
            enabled: boolean;
        };
        registries: {
            enabled: boolean;
        };
    };
    'ember-cli-tailwind'?: {
        shouldIncludeStyleguide: boolean,
    };

    defaultProvider: string;

    pageTitle: {
        prepend: boolean;
    };
};

export default config;
