declare const config: {
    environment: any;
    hostAppName: string;
    indexPageRegistrationsQuery: string;
    modulePrefix: string;
    shareBaseURL: string;
    shareSearchBaseURL: string;
    sourcesWhitelist: Array<{
        name: string;
        https: boolean;
        urlRegex: string;
        display?: string;
    }>;
    featureFlagNames: {
        newStyle: string;
    };
};

export default config;
